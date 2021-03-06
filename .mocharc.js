process.env.NODE_ENV = "test";

module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "tsconfig-paths/register",
    "tools/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "packages/*/src/**/*.spec.ts",
    "packages/*/test/**/*.spec.ts",
  ],
  timeout: 10000
};
