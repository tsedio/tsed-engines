import {promisify} from "../utils/promisify";
import {requireEngine} from "../utils/cache";
import {join} from "path";
import {registerEngine} from "../utils/registerEngine";

const from = () => (path: string, options: any, cb: any) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("teacup/lib/express", "teacup");
    require.extensions[".teacup"] = require.extensions[".coffee"];

    if (path[0] !== "/") {
      path = join(process.cwd(), path);
    }

    if (!options.cache) {
      let callback = cb;
      cb = function (...args: any[]) {
        delete require.cache[path];
        callback.apply(this, args);
      };
    }
    engine.renderFile(path, options, cb);
  });
};

export default registerEngine(
  "teacup",
  (str, options, cb) => {
    const coffee = require("coffee-script");
    const vm = require("vm");
    const sandbox = {
      module: {exports: {}},
      require: require
    };
    return promisify(cb, (cb) => {
      vm.runInNewContext(coffee.compile(str), sandbox);
      const tmpl = sandbox.module.exports as any;
      cb(null, tmpl(options));
    });
  },
  from
);
