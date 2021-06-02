import {cache, requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("ractive", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const Engine = requireEngine("ractive");
    const template = cache(options) || cache(options, Engine.parse(str));
    options.template = template;

    if (options.data === null || options.data === undefined) {
      const extend = (requires.extend || (requires.extend = require("util")._extend));

      // Shallow clone the options object
      options.data = extend({}, options);

      // Remove consolidate-specific properties from the clone
      let i;
      let length;
      let properties = ["template", "filename", "cache", "partials"];

      for (i = 0, length = properties.length; i < length; i++) {
        const property = properties[i];
        delete options.data[property];
      }
    }

    try {
      cb(null, new Engine(options).toHTML());
    } catch (err) {
      cb(err);
    }
  });
});