import {promisify} from "../utils/promisify";
import {cache, requireEngine, requires} from "../utils/cache";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: any) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("marko");
    options.writeToDisk = !!options.cache;

    try {
      const tmpl = cache(options) || cache(options, engine.load(path, options));
      tmpl.renderToString(options, cb);
    } catch (err) {
      cb(err);
    }
  });
};

export default registerEngine('marko', (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("marko");
    options.writeToDisk = !!options.cache;
    options.filename = options.filename || "string.marko";

    try {
      const tmpl = cache(options) || cache(options, engine.load(options.filename, str, options));
      tmpl.renderToString(options, cb);
    } catch (err) {
      cb(err);
    }
  });
}, from);
