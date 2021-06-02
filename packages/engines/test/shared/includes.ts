import {engines} from "@tsed/engines";
import fs from "fs";
import {expect} from "chai";
import {join} from "path";

const rootDir = join(__dirname, "..");

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    it("should support includes", (done) => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/include.${name}`).toString();
      const viewsDir = `${rootDir}/fixtures/${name}`;
      const locals: any = {user: user, settings: {views: viewsDir}};

      if (name === "liquid" || name === "arc-templates") {
        locals.includeDir = viewsDir;
      }

      engine.render(str, locals, (err: any, html: string) => {
        if (err) return done(err);
        try {
          if (name === "liquid") {
            expect(html).to.equal("<p>Tobi</p><section></section><footer></footer>");
          } else {
            expect(html).to.equal("<p>Tobi</p>");
          }
          return done();
        } catch (e) {
          return done(e);
        }
      });
    });

    if (name === "nunjucks") {
      it("should support extending views", (done) => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/layouts.${name}`).toString();
        const locals = {user: user, settings: {views: `${rootDir}/fixtures/${name}`}};

        engine.render(str, locals, (err: unknown, html: string) => {
          if (err) return done(err);
          try {
            expect(html).to.equal("<header></header><p>Tobi</p><footer></footer>");
            return done();
          } catch (e) {
            return done(e);
          }
        });
      });
    }
  });
}
