import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("htmling", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("htmling");
    try {
      const tmpl = cache(options) || cache(options, engine.string(str));
      cb(null, tmpl.render(options));
    } catch (err) {
      cb(err);
    }
  });
});
