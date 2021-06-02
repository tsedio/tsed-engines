import {requireEngine} from "../utils/cache";
import {promisify} from "../utils/promisify";
import {registerEngine} from "../utils/registerEngine";

export default registerEngine("nunjucks", (str, options, cb) => {
  return promisify(cb, function (cb) {
    try {
      const engine = options.nunjucksEnv || requireEngine("nunjucks");
      let env = engine;

      // deprecated fallback support for express
      // <https://github.com/tj/consolidate.js/pull/152>
      // <https://github.com/tj/consolidate.js/pull/224>
      if (options.settings && options.settings.views) {
        env = engine.configure(options.settings.views);
      } else if (options.nunjucks && options.nunjucks.configure) {
        env = engine.configure.apply(engine, options.nunjucks.configure);
      }

      //
      // because `renderString` does not initiate loaders
      // we must manually create a loader for it based off
      // either `options.settings.views` or `options.nunjucks` or `options.nunjucks.root`
      //
      // <https://github.com/mozilla/nunjucks/issues/730>
      // <https://github.com/crocodilejs/node-email-templates/issues/182>
      //

      // so instead we simply check if we passed a custom loader
      // otherwise we create a simple file based loader
      if (options.loader) {
        env = new engine.Environment(options.loader);
      } else if (options.settings && options.settings.views) {
        env = new engine.Environment(
          new engine.FileSystemLoader(options.settings.views)
        );
      } else if (options.nunjucks && options.nunjucks.loader) {
        if (typeof options.nunjucks.loader === "string") {
          env = new engine.Environment(new engine.FileSystemLoader(options.nunjucks.loader));
        } else {
          env = new engine.Environment(
            new engine.FileSystemLoader(
              options.nunjucks.loader[0],
              options.nunjucks.loader[1]
            )
          );
        }
      }

      env.renderString(str, options, cb);
    } catch (err) {
      throw cb(err);
    }
  });
});
