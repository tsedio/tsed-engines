import {engines} from "../utils/cache";
import {ViewEngineOptions} from "../components/Engine";

export function ViewEngine(name: string, options: ViewEngineOptions = {}): ClassDecorator {
  return (target: any) => {
    const instance = new target(name, options);
    engines.set(name, instance);
    engines.set(target, instance);
  };
}
