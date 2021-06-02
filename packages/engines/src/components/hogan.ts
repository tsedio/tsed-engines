import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("hogan", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("hogan.js", "hogan");
    try {
      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      cb(null, tmpl.render(options, options.partials));
    } catch (err) {
      cb(err);
    }
  });
});
