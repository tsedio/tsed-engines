import {engines} from "./cache";
import {EngineOptions} from "../components/Engine";

export type RenderCallback = (err: Error | null, str?: string | any) => any;
export interface EngineFunction {
  (path: string, options: any, cb: RenderCallback): void;
  (path: string, options: any): Promise<string>;

  render(template: string, options: any, cb: RenderCallback): void;
  render(template: string, options: any): Promise<string>;
}

const callbackify = async (fn: any, cb?: RenderCallback) => {
  try {
    const html = await fn();
    cb && cb(null, html);
    return html;
  } catch (er) {
    if (cb) {
      cb(er);
    } else {
      throw er;
    }
  }
};

export function getEngine(name: string): EngineFunction {
  const cb = async (path: string, options: any, cb?: RenderCallback) => {
    return callbackify(() => engines.get(name)!.renderFile(path, options), cb);
  };

  cb.render = async (template: string, options: EngineOptions, cb: RenderCallback) => {
    return callbackify(() => engines.get(name)!.render(template, options), cb);
  };

  return cb as any;
}
let localEngines: any;
export function getEngines(): Record<string, EngineFunction> {
  localEngines =
    localEngines ||
    [...engines.keys()].reduce((acc, key) => {
      if (typeof key === "string") {
        return {
          ...acc,
          [key]: getEngine(key)
        };
      }

      return acc;
    }, {});

  return localEngines;
}
