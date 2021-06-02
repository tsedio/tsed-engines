import {cache, requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("dot", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("dot");
    const extend = (requires.extend || (requires.extend = require("util")._extend));

    try {
      let settings = {};
      settings = extend(settings, engine.templateSettings);
      settings = extend(settings, options ? options.dot : {});
      const tmpl = cache(options) || cache(options, engine.template(str, settings, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
});