import {requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("jqtpl", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const engine = requireEngine("jqtpl");
    try {
      engine.template(str, str);
      cb(null, engine.tmpl(str, options));
    } catch (err) {
      cb(err);
    }
  });
});
