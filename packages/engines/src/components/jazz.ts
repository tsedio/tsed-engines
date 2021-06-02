import {cache, requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("jazz", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("jazz");
    try {
      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      tmpl.eval(options, (str: string) => {
        cb(null, str);
      });
    } catch (err) {
      cb(err);
    }
  });
});