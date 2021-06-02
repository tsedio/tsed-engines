import {readFile} from "fs";
import {extname, resolve} from "path";
import {cache, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";
import {EngineCallback} from "../interfaces";

/**
 * Note that in order to get filters and custom tags we've had to push
 * all user-defined locals down into @locals. However, just to make things
 * backwards-compatible, any property of `options` that is left after
 * processing and removing `locals`, `meta`, `filters`, `customTags` and
 * `includeDir` will also become a local.
 */

function renderTinyliquid(engine: any, str: string, options: any, cb: EngineCallback) {
  const context = engine.newContext();
  let k: string;

  /**
   * Note that there's a bug in the library that doesn't allow us to pass
   * the locals to newContext(), hence looping through the keys:
   */

  if (options.locals) {
    for (k in options.locals) {
      context.setLocals(k, options.locals[k]);
    }
    delete options.locals;
  }

  if (options.meta) {
    context.setLocals("page", options.meta);
    delete options.meta;
  }

  /**
   * Add any defined filters:
   */

  if (options.filters) {
    for (k in options.filters) {
      context.setFilter(k, options.filters[k]);
    }
    delete options.filters;
  }

  /**
   * Set up a callback for the include directory:
   */

  const includeDir = options.includeDir || process.cwd();

  context.onInclude((name: string, callback: any) => {
    const ext = extname(name) ? "" : ".liquid";
    const filename = resolve(includeDir, name + ext);

    readFile(filename, {encoding: "utf8"}, (err, data) => {
      if (err) return callback(err);
      callback(null, engine.parse(data));
    });
  });
  delete options.includeDir;

  /**
   * The custom tag functions need to have their results pushed back
   * through the parser, so set up a shim before calling the provided
   * callback:
   */

  const compileOptions = {
    customTags: {} as any
  };

  if (options.customTags) {
    var tagFunctions = options.customTags;

    for (k in options.customTags) {
      /*Tell jshint there's no problem with having this function in the loop */
      /*jshint -W083 */
      compileOptions.customTags[k] = (context: any, name: string, body: any) => {
        const tpl = tagFunctions[name](body.trim());
        context.astStack.push(engine.parse(tpl));
      };
      /*jshint +W083 */
    }
    delete options.customTags;
  }

  /**
   * Now anything left in `options` becomes a local:
   */

  for (k in options) {
    context.setLocals(k, options[k]);
  }

  /**
   * Finally, execute the template:
   */

  const tmpl = cache(context) || cache(context, engine.compile(str, compileOptions));
  tmpl(context, cb);
}

export default registerEngine("liquid", (str, options, cb) => {
  return promisify(cb, async (cb) => {
    let Liquid;
    let engine;

    try {
      // set up tinyliquid engine
      engine = requires.liquid = require("tinyliquid");

      // use tinyliquid engine
      renderTinyliquid(engine, str, options, cb);

      return;
    } catch (err) {

      // set up liquid-node engine
      try {
        Liquid = requires.liquid = require("liquid-node");
        engine = new Liquid.Engine();
      } catch (err) {
        throw err;
      }
    }

    // use liquid-node engine
    try {
      const locals = options.locals || {};

      if (options.meta) {
        locals.pages = options.meta;
        delete options.meta;
      }

      /**
       * Add any defined filters:
       */

      if (options.filters) {
        engine.registerFilters(options.filters);
        delete options.filters;
      }

      /**
       * Set up a callback for the include directory:
       */

      const includeDir = options.includeDir || process.cwd();

      engine.fileSystem = new Liquid.LocalFileSystem(includeDir, "liquid");

      delete options.includeDir;

      /**
       * The custom tag functions need to have their results pushed back
       * through the parser, so set up a shim before calling the provided
       * callback:
       */

      if (options.customTags) {
        const tagFunctions = options.customTags;

        for (const k in options.customTags) {
          engine.registerTag(k, tagFunctions[k]);
        }
        delete options.customTags;
      }

      /**
       * Now anything left in `options` becomes a local:
       */

      for (const k in options) {
        locals[k] = options[k];
      }

      /**
       * Finally, execute the template:
       */
      const result = await engine.parseAndRender(str, locals)

      cb(null, result);
    } catch (err) {
      cb(err);
    }
  });
});

