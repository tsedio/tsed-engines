import {engines} from "@tsed/engines";
import {join} from "path";
import fs from "fs";
import {expect} from "chai";

const rootDir = join(__dirname, "..");

export function test(name: string) {
  const user = {name: "Tobi"};
  const engine = engines.get(name)!;

  describe(name, () => {
    if (name === "dust") {
      it("should support rendering a partial", (done) => {
        const str = fs.readFileSync(`${rootDir}/fixtures/${name}/user_partial.${name}`).toString();
        const locals = {
          user: user,
          views: `${rootDir}/fixtures/${name}`
        };
        engine.render(str, locals, (err, html) => {
          if (err) return done(err);
          expect(html).to.equal("<p>Tobi from partial!</p><p>Tobi</p>");
          done();
        });
      });
    } else {
      it("should support partials", function (done) {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: "user"}};
        engine(path, locals, function (err, html) {
          if (err) return done(err);
          expect(html).to.equal("<p>Tobi</p>");
          done();
        });
      });
      it("should support absolute path partial", function (done) {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: join(__dirname, "/../../test/fixtures/", name, "/user")}};
        engine(path, locals, function (err, html) {
          if (err) return done(err);
          expect(html).to.equal("<p>Tobi</p>");
          done();
        });
      });
      it("should support relative path partial", function (done) {
        const path = `${rootDir}/fixtures/${name}/partials.${name}`;
        const locals = {user: user, partials: {partial: "../" + name + "/user"}};
        engine(path, locals, function (err, html) {
          if (err) return done(err);
          expect(html).to.equal("<p>Tobi</p>");
          done();
        });
      });
    }
  });
}
