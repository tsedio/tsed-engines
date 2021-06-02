import {cache, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

/**
 * Swig string support.
 */

export default registerEngine("swig", (str, options, cb) => {
  return promisify(cb, (cb) => {
    let engine = requires.swig;
    if (!engine) {
      try {
        engine = requires.swig = require("swig");
      } catch (err) {
        try {
          engine = requires.swig = require("swig-templates");
        } catch (otherError) {
          throw err;
        }
      }
    }

    try {
      if (options.cache === true) options.cache = "memory";
      engine.setDefaults({cache: options.cache});
      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
});
