import {requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("plates", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("plates");
    const map = options.map || undefined;
    try {
      const tmpl = engine.bind(str, options, map);
      cb(null, tmpl);
    } catch (err) {
      cb(err);
    }
  });
});
