import {engines, requires} from "@tsed/engines";
import {expect} from "chai";
import fs from "fs";
import {join} from "path";

const rootDir = join(__dirname, "..");

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    it("should support locals", (done) => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};

      engine(path, locals, (err, html) => {
        if (err) return done(err);
        expect(html).to.match(/Tobi/);
        done();
      });
    });

    describe("not cache", () => {
      it("should not cache by default", (done) => {
        const path = `${rootDir}/fixtures/${name}/user.${name}`;
        const locals = {user: user};

        engine(path, locals, (err, html) => {
          if (err) return done(err);
          expect(html).to.match(/Tobi/);

          engine(path, locals, (err, html) => {
            if (err) return done(err);
            expect(html).to.match(/Tobi/);
            done();
          });
        });
      });
    });

    describe("with cache", () => {
      it("should support caching", function (done) {
        const path = `${rootDir}/fixtures/${name}/user.${name}`;
        const locals = {user: user, cache: true};

        engine(path, locals, (err, html) => {
          if (err) return done(err);

          html.should.match(/Tobi/);
          engine(path, locals, (err, html) => {
            if (err) return done(err);
            expect(html).to.match(/Tobi/);
            done();
          });
        });
      });

      it("should support rendering a string", function (done) {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
        const locals = {user: user};

        engine.render(str, locals, function (err, html) {
          if (err) return done(err);
          html.should.match(/Tobi/);
          done();
        });
      });

      it("should return a promise if no callback provided", async () => {
        const path = `${rootDir}/fixtures/${name}/user.${name}`;
        const locals = {user: user};
        const result = await engine(path, locals);
        expect(result).to.match(/Tobi/);
      });
    });

    it("should return a promise if no callback provided (string)", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};
      const result = await engine.render(str, locals);

      expect(result).to.match(/Tobi/);
    });

    it("should be exposed in the requires object", function () {
      expect(!!requires[name]).to.true;
    });
  });
}
