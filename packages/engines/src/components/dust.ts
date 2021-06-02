import {cache, read, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {extname} from "path";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("dust", (str, options, cb) => {
  return promisify(cb, function (cb) {
    let engine = requires.dust;
    if (!engine) {
      try {
        engine = requires.dust = require("dustjs-helpers");
      } catch (err) {
        engine = requires.dust = require("dustjs-linkedin");
      }
    }

    let ext = "dust";
    let views = ".";

    if (options) {
      if (options.ext) {
        ext = options.ext;
      }
      if (options.views) {
        views = options.views;
      }
      if (options.settings && options.settings.views) {
        views = options.settings.views;
      }
    }
    if (!options || (options && !options.cache)) engine.cache = {};

    engine.onLoad = async (path: string, callback: any) => {
      if (extname(path) === "") {
        path += `.${ext}`;
      }
      if (path[0] !== "/") {
        path = `${views}/${path}`;
      }
      try {
        callback(null, await read(path, options));
      } catch (er) {
        callback(er);
      }
    };

    try {
      let templateName;

      if (options.filename) {
        templateName = options.filename.replace(new RegExp("^" + views + "/"), "").replace(new RegExp("\\." + ext), "");
      }

      const tmpl = cache(options) || cache(options, engine.compileFn(str, templateName));
      tmpl(options, cb);
    } catch (err) {
      cb(err);
    }
  });
});
