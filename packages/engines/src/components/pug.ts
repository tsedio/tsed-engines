import {promisify} from "../utils/promisify";
import {cache, requires} from "../utils/cache";
import {EngineCallback} from "../interfaces";
import {registerEngine} from "../utils/registerEngine";

function getEngine() {
  let engine = requires.pug;
  if (!engine) {
    try {
      engine = requires.pug = require("pug");
    } catch (err) {
      try {
        engine = requires.pug = require("then-pug");
      } catch (otherError) {
        throw err;
      }
    }
  }
  return engine;
}

const from = () => (path: string, options: any, cb: EngineCallback) => {
  return promisify(cb, (cb) => {
    let engine = getEngine();

    try {
      const tmpl = cache(options) || cache(options, engine.compileFile(path, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
};

export default registerEngine("pug", (str, options, cb) => {
  return promisify(cb, function (cb) {
    let engine = getEngine();


    try {
      const tmpl = cache(options) || cache(options, engine.compile(str, options));
      cb(null, tmpl(options));
    } catch (err) {
      cb(err);
    }
  });
}, from);
