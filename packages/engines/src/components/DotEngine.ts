import {engines, extend} from "../utils/cache";
import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("dot")
export class DotEngine extends Engine {
  getSettings(options: any) {
    const settings = extend({}, this.engine.templateSettings);
    return extend(settings, options ? options.dot : {});
  }

  protected $compile(template: string, options: any) {
    return this.engine.template(template, this.getSettings(options), options);
  }
}
