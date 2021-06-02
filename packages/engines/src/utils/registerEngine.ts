import {cache, engines, fromStringRenderer, requireEngine} from "./cache";
import {Engine, EngineCallback, RenderCallback} from "../interfaces";
import {promisify} from "./promisify";

export const defaultRender = (engine: { compile(str: string, options: any): string }) =>
  (str: string, options: any, cb: EngineCallback) => {
    return promisify(cb, (cb) => {
      try {
        const tmpl = cache(options) || cache(options, engine.compile(str, options));
        cb(null, tmpl(options));
      } catch (err) {
        cb(err);
      }
    });
  };

export function registerEngine(name: string, renderFn?: RenderCallback, from = fromStringRenderer) {
  const engine = from(name) as unknown as Engine;

  if (!renderFn) {
    renderFn = defaultRender(requireEngine(name));
  }

  engine.render = renderFn as any;

  engines.set(name, engine);

  return {[name]: engine};
}
