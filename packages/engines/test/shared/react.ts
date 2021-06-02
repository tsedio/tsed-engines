import {engines} from "@tsed/engines";
import { expect } from "chai";
import fs from "fs";
import sinon from "sinon";
import {join} from "path";

const rootDir = join(__dirname, '..')
const sandbox = sinon.createSandbox();

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    beforeEach(() => {
      sandbox.stub(fs, "readFile");
      sandbox.stub(fs, "readFileSync");
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("should support locals",  (done)=> {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      engine(path, locals, function (err, html) {

        if (err) {
          return done(err);
        }

        expect(html).to.equal("<p>Tobi</p>");
        done();
      });
    });

    it("should support promises", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      const html = await engine(path, locals);

      expect(html).to.equal("<p>Tobi</p>");
    });

    it("should support rendering a string",  (done)=> {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};

      engine.render(str, locals, function (err, html) {
        if (err) {
          return done(err);
        }

        expect(html).to.equal("<p>Tobi</p>");
        done();
      });
    });

    it("should support promises from a string", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};

      const html = await engine.render(str, locals);

      expect(html).to.equal("<p>Tobi</p>");
    });

    it("should support rendering into a base template", (done) => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {
        user: user,
        base: "test/fixtures/" + name + "/base.html",
        title: "My Title"
      };

      engine(path, locals, (err, html) => {
        if (err) {
          return done(err);
        }

        expect(html).to.equal("<html><head><title>My Title</title></head><body><p>Tobi</p></body></html>");
        done();
      });
    });
  });
}
