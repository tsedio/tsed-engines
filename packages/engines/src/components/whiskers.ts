import {promisify} from "../utils/promisify";
import {requireEngine} from "../utils/cache";
import {EngineCallback} from "../interfaces";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: EngineCallback) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("whiskers");
    engine.__express(path, options, cb);
  });
};

export default registerEngine("whiskers", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("whiskers");

    try {
      cb(null, engine.render(str, options));
    } catch (err) {
      cb(err);
    }
  });
}, from);