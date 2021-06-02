import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("underscore", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("underscore");
    try {
      const partials: any = {};
      for (const partial in options.partials) {
        partials[partial] = engine.template(options.partials[partial]);
      }
      options.partials = partials;

      const tmpl = cache(options) || cache(options, engine.template(str, null, options));
      cb(null, tmpl(options).replace(/\n$/, ""));
    } catch (err) {
      cb(err);
    }
  });
});
