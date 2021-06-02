import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("templayed", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("templayed");
    try {
      const tmpl = cache(options) || cache(options, engine(str));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
});
