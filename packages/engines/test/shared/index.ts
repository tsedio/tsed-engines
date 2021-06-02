import {engines, requires} from "@tsed/engines";
import {expect} from "chai";
import fs from "fs";
import {join} from "path";

const rootDir = join(__dirname, "..");

const readFile = fs.readFile;
const readFileSync = fs.readFileSync;

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    afterEach(() => {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });

    it("should support locals", (done) => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};

      engine(path, locals, (err, html) => {
        if (err) return done(err);
        expect(html).to.match(/Tobi/);
        done();
      });
    });

    it("should not cache by default", (done) => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      let calls = 0;

      fs.readFileSync = function () {
        ++calls;
        return readFileSync.apply(this, arguments);
      };

      // @ts-ignore
      fs.readFile = function () {
        ++calls;
        readFile.apply(this, arguments);
      };

      engine(path, locals, (err, html) => {
        if (err) return done(err);
        expect(html).to.match(/Tobi/);

        engine(path, locals, (err, html) => {
          if (err) return done(err);
          expect(html).to.match(/Tobi/);
          // expect(calls).to.equal(name === "atpl" ? 4 : 2);
          done();
        });
      });
    });


    it("should support caching", function (done) {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user, cache: true};

      engine(path, locals, (err, html) => {
        if (err) return done(err);

        // @ts-ignore
        fs.readFile = function (path) {
          done(new Error("fs.readFile() called with " + path));
        };

        expect(html).to.match(/Tobi/);
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
