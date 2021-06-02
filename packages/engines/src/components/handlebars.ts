import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("handlebars", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("handlebars");
    try {
      for (const partial in options.partials) {
        engine.registerPartial(partial, options.partials[partial]);
      }
      for (const helper in options.helpers) {
        engine.registerHelper(helper, options.helpers[helper]);
      }
      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
});
