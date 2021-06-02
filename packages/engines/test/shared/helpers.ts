import {engines} from "@tsed/engines";
import handlebars from "handlebars";
import fs from "fs";
import {expect} from "chai";
import {join} from "path";

const Sqrl = require("squirrelly");

const rootDir = join(__dirname, "..");

export function test(name: string) {
  const engine = engines.get(name)!;

  describe(name, () => {
    let user: any;

    if (name === "handlebars") {
      user = {name: "<strong>Tobi</strong>"};

      // Use case: return safe HTML that won’t be escaped in the final render.
      it("should support helpers", function (done) {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();

        const locals = {
          user: user,
          helpers: {
            safe(object: any) {
              return new handlebars.SafeString(object);
            }
          }
        };

        engine.render(str, locals, function (err, html) {
          if (err) return done(err);
          expect(html).to.equal("<strong>Tobi</strong>");
          done();
        });
      });
    } else if (name === "squirrelly") {
      user = {name: "<strong>Tobi</strong>"};

      // Use case: return safe HTML that won’t be escaped in the final render.
      it("should support helpers", function (done) {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();

        Sqrl.defineHelper("myhelper", (args: string[], content: any, blocks: any) => {
          return args[0].slice(1, -1);
        });

        const options = {user: user};

        engine.render(str, options, (err, html) => {
          if (err) return done(err);
          expect(html).to.equal("strong>Tobi</strong");
          done();
        });
      });
    }

    if (name === "vash") {
      user = {name: "Tobi"};

      // See this for Vash helper system : https://github.com/kirbysayshi/vash#helper-system
      // Use case: return as as lower case
      it("should support helpers", function (done) {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/helpers.${name}`).toString();

        const locals = {
          user: user,
          helpers: {
            lowerCase(text: string) {
              return text.toLowerCase();
            }
          }
        };

        engine.render(str, locals, (err, html) => {
          if (err) return done(err);
          expect(html).to.equal("<strong>tobi</strong>");
          done();
        });
      });
    }
  });
}