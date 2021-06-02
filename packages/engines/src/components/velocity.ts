import {requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("velocityjs", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("velocityjs");
    try {
      options.locals = options;
      cb(null, engine.render(str, options).trimLeft());
    } catch (err) {
      cb(err);
    }
  });
});
