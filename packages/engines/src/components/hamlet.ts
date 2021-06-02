import {requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("hamlet", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("hamlet");
    try {
      options.locals = options;
      cb(null, engine.render(str, options).trimLeft());
    } catch (err) {
      cb(err);
    }
  });
});
