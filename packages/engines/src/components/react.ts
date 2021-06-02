import {resolve} from "path";
import {registerEngine} from "../utils/registerEngine";
import {cache, getFromCache, requireEngine, setToCache} from "../utils/cache";
import {promisify} from "../utils/promisify";
import { readFileSync } from "fs";

export function requireReact(module: any, filename: string) {
  const babel = requireEngine("babel-core", "babel");
  const compiled = babel.transformFileSync(filename, {presets: ["react"]}).code;

  return module._compile(compiled, filename);
}

/**
 *  Converting a string into a node module.
 */
function requireReactString(src: string, filename?: string) {
  const babel = requireEngine("babel-core", "babel");

  if (!filename) filename = "";
  // @ts-ignore
  const m = new module.constructor();
  filename = filename || "";

  // Compile Using React
  const compiled = babel.transform(src, {presets: ["react"]}).code;

  // Compile as a module
  m.paths = module.paths;
  m._compile(compiled, filename);

  return m.exports;
}

/**
 * A naive helper to replace {{tags}} with options.tags content
 */
function reactBaseTmpl(data: any, options: any) {
  let exp: any;
  let regex: any;

  // Iterates through the keys in file object
  // and interpolate / replace {{key}} with it's value
  for (const k in options) {
    if (options.hasOwnProperty(k)) {
      exp = `{{${k}}}`;
      regex = new RegExp(exp, "g");
      if (data.match(regex)) {
        data = data.replace(regex, options[k]);
      }
    }
  }

  return data;
}


/**
 *  The main render parser for React based templates
 */
function reactRenderer(type: any) {
  if (require.extensions) {

    // Ensure JSX is transformed on require
    if (!require.extensions[".jsx"]) {
      require.extensions[".jsx"] = requireReact;
    }

    // Supporting .react extension as well as test cases
    // Using .react extension is not recommended.
    if (!require.extensions[".react"]) {
      require.extensions[".react"] = requireReact;
    }

  }

  // Return rendering fx
  return (str: string, options: any, cb: any) => {
    return promisify(cb, (cb) => {
      // React Import
      const ReactDOM = requireEngine("react-dom/server","ReactDOM");
      const react = requireEngine('react');

      // Assign HTML Base
      const base = options.base;
      delete options.base;

      const enableCache = options.cache;
      delete options.cache;

      const isNonStatic = options.isNonStatic;
      delete options.isNonStatic;

      // Start Conversion
      try {
        let Code;
        let Factory;

        let baseStr;
        let content;
        let parsed;

        if (!cache(options)) {
          // Parsing
          if (type === "path") {
            var path = resolve(str);
            delete require.cache[path];
            Code = require(path);
          } else {
            Code = requireReactString(str);
          }
          Factory = cache(options, react.createFactory(Code));

        } else {
          Factory = cache(options);
        }

        parsed = new Factory(options);
        content = (isNonStatic) ? ReactDOM.renderToString(parsed) : ReactDOM.renderToStaticMarkup(parsed);

        if (base) {
          baseStr = getFromCache(str) || readFileSync(resolve(base), "utf8");

          if (enableCache) {
            setToCache(str, baseStr);
          }

          options.content = content;
          content = reactBaseTmpl(baseStr, options);
        }

        cb(null, content);

      } catch (err) {
        cb(err);
      }
    });
  };
}

export default registerEngine("react", reactRenderer("string"), () => reactRenderer("path"));