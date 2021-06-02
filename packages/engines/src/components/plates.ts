import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";
import {requireEngine} from "@tsed/engines";

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
