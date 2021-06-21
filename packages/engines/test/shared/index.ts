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

    it("should support locals", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};

      const html = await engine.renderFile(path, locals);
      expect(html).to.match(/Tobi/);
    });

    it("should not cache by default", async () => {
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

      const html = await engine.renderFile(path, locals);
      expect(html).to.match(/Tobi/);

      await engine.renderFile(path, locals);

      expect(html).to.match(/Tobi/);
    });

    it("should support rendering a string", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};

      const html = await engine.render(str, locals);
      html.should.match(/Tobi/);
    });

    it("should be exposed in the requires object", function () {
      expect(!!requires.get(name)).to.true;
    });
  });
}
