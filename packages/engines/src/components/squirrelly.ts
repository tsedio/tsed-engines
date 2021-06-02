import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("squirrelly", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("squirrelly");
    try {
      for (const partial in options.partials) {
        engine.definePartial(partial, options.partials[partial]);
      }
      for (const helper in options.helpers) {
        engine.defineHelper(helper, options.helpers[helper]);
      }
      const tmpl = cache(options) || cache(options, engine.Compile(str, options));
      cb(null, tmpl(options, engine));
    } catch (err) {
      cb(err);
    }
  });
});
