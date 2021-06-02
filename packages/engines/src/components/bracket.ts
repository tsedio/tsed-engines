import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("bracket", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("bracket-template", "bracket");
    try {
      const tmpl = cache(options) || cache(options, engine.default.compile(str, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
});
