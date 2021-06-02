import {promisify} from "../utils/promisify";
import {requires} from "../utils/cache";
import {EngineCallback} from "../interfaces";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: EngineCallback) => {
  return promisify(cb, function (cb) {
    let engine = requires.just;
    if (!engine) {
      const JUST = require("just");
      engine = requires.just = new JUST();
    }
    engine.configure({useCache: options.cache});
    engine.render(path, options, cb);
  });
};

export default registerEngine("just", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const JUST = require("just");
    const engine = new JUST({root: {page: str}});
    engine.render("page", options, cb);
  });
}, from);
