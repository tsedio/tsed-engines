import {cache, requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("twig", (str, options, cb) => {
  return promisify(cb, (cb) => {
    const {twig: engine} = requireEngine("twig");

    const templateData = {
      data: str,
      allowInlineIncludes: options.allowInlineIncludes,
      namespaces: options.namespaces,
      path: options.path
    };

    try {
      const tmpl = cache(templateData) || cache(templateData, engine(templateData));
      cb(null, tmpl.render(options));
    } catch (err) {
      cb(err);
    }
  });
});