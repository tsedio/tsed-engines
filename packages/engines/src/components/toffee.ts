import {promisify} from "../utils/promisify";
import {requireEngine} from "../utils/cache";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: any) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("toffee");
    engine.__consolidate_engine_render(path, options, cb);
  });
};

/**
 * Toffee string support.
 */

export default registerEngine("toffee", (str, options, cb) => {
  return promisify(cb,  (cb) => {
    const engine = requireEngine("toffee");
    try {
      engine.str_render(str, options, cb);
    } catch (err) {
      cb(err);
    }
  });
}, from);