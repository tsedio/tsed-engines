import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("bracket", {
  requires: "bracket-template"
})
export class BracketEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.default.compile(template, options);
  }
}
