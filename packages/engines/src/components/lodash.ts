import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("lodash", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("lodash");
    try {
      const tmpl = cache(options) || cache(options, engine.template(str, options));
      cb(null, tmpl(options).replace(/\n$/, ""));
    } catch (err) {
      cb(err);
    }
  });
});
