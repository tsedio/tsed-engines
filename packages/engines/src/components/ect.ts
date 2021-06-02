import {promisify} from "../utils/promisify";
import {requires} from "../utils/cache";
import {EngineCallback} from "../interfaces";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: EngineCallback) => {
  return promisify(cb, (cb) => {
    let engine = requires.ect;
    if (!engine) {
      const ECT = require("ect");
      engine = requires.ect = new ECT(options);
    }
    engine.configure({cache: options.cache});
    engine.render(path, options, cb);
  });
};

export default registerEngine(
  "ect",
  (str, options, cb) => {
    return promisify(cb, (cb) => {
      const ECT = require("ect");
      const engine = new ECT({root: {page: str}});
      engine.render("page", options, cb);
    });
  },
  from
);
