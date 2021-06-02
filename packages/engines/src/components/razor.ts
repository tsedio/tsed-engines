import {promisify} from "../utils/promisify";
import {cache, requires} from "../utils/cache";
import {registerEngine} from "../utils/registerEngine";
import {EngineCallback} from "../interfaces";

function getEngine() {
  try {
    return (requires.razor = requires.razor || require("razor-tmpl"));
  } catch (err) {
    throw err;
  }
}

const from = () => (path: string, options: any, cb: EngineCallback): Promise<any> => {
  return promisify(cb, function (cb) {
    const engine = getEngine();
    try {
      const tmpl =
        cache(options) ||
        cache(options, (locals: any) => {
          console.log("Rendering razor file", path);
          return engine.renderFileSync(path, locals);
        });
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
};

export default registerEngine(
  "razor",
  (str, options, cb) => {
    return promisify(cb, function (cb) {
      const engine = getEngine();

      try {
        const tf = engine.compile(str);
        const tmpl = cache(options) || cache(options, tf);
        cb(null, tmpl(options));
      } catch (err) {
        cb(err);
      }
    });
  },
  from
);
