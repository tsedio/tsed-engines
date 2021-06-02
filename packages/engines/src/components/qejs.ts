import {requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("qejs", (str, options, cb) => {
  return promisify(cb, (cb) => {
    try {
      const engine = requireEngine("qejs");
      engine.render(str, options).then((result: string) => {
        cb(null, result);
      }, (err: unknown) => {
        cb(err);
      }).done();
    } catch (err) {
      cb(err);
    }
  });
})