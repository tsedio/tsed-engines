import {engines} from "@tsed/engines";
import {expect} from "chai";
import fs from "fs";
import sinon from "sinon";
import {join} from "path";

const rootDir = join(__dirname, "..");
const sandbox = sinon.createSandbox();

const readFile = fs.readFile;
const readFileSync = fs.readFileSync;

export function test(name: string) {
  const engine = engines.get(name)!;
  const user = {name: "Tobi"};

  describe(name, () => {
    beforeEach(() => {
      fs.readFile = readFile;
      fs.readFileSync = readFileSync;
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("should support locals", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      const html = await engine.renderFile(path, locals);

      expect(html).to.equal("<p>Tobi</p>");
    });

    it("should support promises", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {user: user};
      const html = await engine.renderFile(path, locals);

      expect(html).to.equal("<p>Tobi</p>");
    });

    it("should support rendering a string", async () => {
      const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user.${name}`).toString();
      const locals = {user: user};

      const html = await engine.render(str, locals);
      expect(html).to.equal("<p>Tobi</p>");
    });

    it("should support rendering into a base template", async () => {
      const path = `${rootDir}/fixtures/${name}/user.${name}`;
      const locals = {
        user: user,
        base: `${rootDir}/fixtures/${name}/base.html`,
        title: "My Title"
      };

      const html = await engine.renderFile(path, locals);
      expect(html).to.equal("<html><head><title>My Title</title></head><body><p>Tobi</p></body></html>");
    });
  });
}
