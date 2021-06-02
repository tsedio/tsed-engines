import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("walrus", (str, options, cb) => {
  return promisify(cb,  (cb) => {
    const engine = requireEngine("walrus");
    try {
      const tmpl = cache(options) || cache(options, engine.parse(str));
      cb(null, tmpl.compile(options));
    } catch (err) {
      cb(err);
    }
  });
});