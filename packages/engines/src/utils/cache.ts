import fs from "fs";
import {dirname, extname, isAbsolute, join} from "path";
import {promisify} from "./promisify";
import {Engine, EngineCallback} from "../interfaces";

const readCache: Map<string, string> = new Map();
const cacheStore: Map<string, any> = new Map();

export const engines: Map<string, Engine> = new Map();
export const requires: Record<string, any> = {};

export function requireEngine(name: string, toName: string = name) {
  return requires[toName] || (requires[toName] = require(name));
}

export function setToCache(key: string, value: any) {
  readCache.set(key, value);
}

export function getFromCache(key: string) {
  return readCache.get(key);
}

/**
 * Clear the cache.
 *
 * @api public
 */

export const clearCache = () => {
  readCache.clear();
  cacheStore.clear();
};

/**
 * Conditionally cache `compiled` template based
 * on the `options` filename and `.cache` boolean.
 *
 * @param {Object} options
 * @param {Function} compiled
 * @return {Function}
 */
export function cache(options: any, compiled?: any) {
  // cachable
  if (compiled && options.filename && options.cache) {
    readCache.delete(options.filename);
    cacheStore.set(options.filename, compiled);
    return compiled;
  }

  // check cache
  if (options.filename && options.cache) {
    return cacheStore.get(options.filename);
  }

  return compiled;
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the template string will be cached.
 *
 * @param path
 * @param {String} options
 * @param {Function} cb
 */
export function read(path: string, options: any, cb: EngineCallback) {
  const str = readCache.get(path);
  const cached = options.cache && str && typeof str === "string";

  // cached (only if cached is a string and not a compiled template function)
  if (cached) {
    return cb(null, str);
  }

  // read
  fs.readFile(path, "utf8", (err, str) => {
    if (err) {
      return cb(err);
    }
    // remove extraneous utf8 BOM marker
    str = str.replace(/^\uFEFF/, "");

    if (options.cache) {
      readCache.set(path, str);
    }

    cb(null, str);
  });
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the partial string will be cached.
 *
 * @param path
 * @param {String} options
 * @param cb
 * @api private
 */
export function readPartials(path: string, options: any, cb: (err?: unknown, str?: string | any) => void) {
  if (!options.partials) {
    return cb();
  }

  const keys = Object.keys(options.partials);
  const partials: Record<string, string> = {};

  function next(index: number): void {
    if (index === keys.length) {
      return cb(null, partials);
    }

    const key = keys[index];
    const partialPath = options.partials[key];

    if (partialPath === undefined || partialPath === null || partialPath === false) {
      return next(++index);
    }

    let file;
    if (isAbsolute(partialPath)) {
      if (extname(partialPath) !== "") {
        file = partialPath;
      } else {
        file = join(partialPath + extname(path));
      }
    } else {
      file = join(dirname(path), partialPath + extname(path));
    }

    read(file, options, function (err, str) {
      if (err) return cb(err);
      partials[key] = str;
      next(++index);
    });
  }

  next(0);
}

export function fromStringRenderer(name: string) {
  return (path: string, options: any, cb: EngineCallback) => {
    options.filename = path;

    return promisify(cb, (cb: (err?: unknown, str?: string | any) => void) => {
      readPartials(path, options, function (err, partials) {
        const extend = (requires.extend || (requires.extend = require("util")._extend));
        const opts = extend({}, options);
        opts.partials = partials;

        if (err) {
          return cb(err);
        }

        if (cache(opts)) {
          engines.get(name)!.render("", opts, cb);
        } else {
          read(path, opts, function (err, str) {
            if (err) {
              return cb(err);
            }
            engines.get(name)!.render(str, opts, cb);
          });
        }
      });
    });
  };
}