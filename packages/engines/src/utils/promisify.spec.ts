import {promisify} from "@tsed/engines";
import {expect} from "chai";

describe("promisify()", () => {
  it("should promisify handler", async () => {
    const result = await promisify(undefined, (cb) => {
      cb(null, "test");
    });

    expect(result).to.equal("test");
  });

  it("should promisify handler (throw error)", async () => {
    let actualError: any;
    try {
      await promisify(undefined, (cb) => {
        cb(new Error("test"));
      });
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.equal("test");
  });
});
