import {engines, requires} from "@tsed/engines";
import fs from "fs";
import {expect} from "chai";
import {join} from "path";

const rootDir = join(__dirname, '..')

export function test(name: string) {
  const user = {name: "Tobi"};

  describe(name, () => {
    // Use case: return upper case string.
    it("should support fetching template name from the context", (done) => {
      const viewsDir = `${rootDir}/fixtures/${name}`;
      const templatePath = `${viewsDir}/user_template_name.${name}`;
      const str = fs.readFileSync(templatePath).toString();

      const locals = {
        user: user,
        views: viewsDir,
        filename: templatePath
      };

      if (name === "dust") {
        const dust = require("dustjs-helpers");
        dust.helpers.templateName = (chunk: any, context: any) => {
          return chunk.write(context.getTemplateName());
        };

        requires.dust = dust;
      }

      engines.get(name)!.render(str, locals, (err: any, html: string) => {
        if (err) return done(err);
        expect(html).to.equal("<p>Tobi</p>user_template_name");
        return done();
      });
    });
  });
}
