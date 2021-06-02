import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("vash", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("vash");

    try {
      // helper system : https://github.com/kirbysayshi/vash#helper-system
      if (options.helpers) {
        for (const key in options.helpers) {
          if (!options.helpers.hasOwnProperty(key) || typeof options.helpers[key] !== "function") {
            continue;
          }
          engine.helpers[key] = options.helpers[key];
        }
      }

      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      tmpl(options, function sealLayout(err: unknown, ctx: any) {
        if (err) cb(err);
        ctx.finishLayout();
        cb(null, ctx.toString().replace(/\n$/, ""));
      });
    } catch (err) {
      cb(err);
    }
  });
});
