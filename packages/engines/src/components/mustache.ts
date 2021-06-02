import {requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("mustache", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("mustache");
    try {
      cb(null, engine.render(str, options, options.partials));
    } catch (err) {
      cb(err);
    }
  });
});