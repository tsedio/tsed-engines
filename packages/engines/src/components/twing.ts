import {cache, requireEngine, requires} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("twing", (str, options, cb) => {
  return promisify(cb, function (cb) {
    const engine = requireEngine("twing");
    try {
      new engine.TwingEnvironment(new engine.TwingLoaderNull()).createTemplate(str).then((twingTemplate: any) => {
        twingTemplate.render(options).then((rendTmpl: string) => {
          const tmpl = cache(options) || cache(options, rendTmpl);
          cb(null, tmpl);
        });
      });
    } catch (err) {
      cb(err);
    }
  });
});
