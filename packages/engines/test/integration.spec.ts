import * as sharedTest from "./shared";
import * as sharedFiltersTest from "./shared/filters";
import * as sharedIncludesTest from "./shared/includes";
import * as sharedPartialsTest from "./shared/partials";
import * as sharedHelpersTest from "./shared/helpers";
import {requires} from "../src";

describe("integration", () => {
  sharedTest.test("pug");

  // testing tinyliquid
  requires.liquid = require("tinyliquid");
  //
  sharedTest.test("liquid");
  sharedFiltersTest.test("liquid");
  sharedIncludesTest.test("liquid");
  //
  // // testing liquid-node
  requires.liquid = require("liquid-node");
  //
  sharedTest.test("liquid");
  sharedFiltersTest.test("liquid");
  sharedIncludesTest.test("liquid");
  //
  sharedTest.test("ejs");
  sharedTest.test("swig");
  sharedTest.test("jazz");
  sharedTest.test("jqtpl");
  sharedTest.test("liquor");
  sharedTest.test("haml");
  sharedTest.test("hamlet");
  sharedTest.test("whiskers");
  sharedTest.test("haml-coffee");
  sharedTest.test("hogan");
  sharedPartialsTest.test("hogan");
  sharedTest.test("dust");
  sharedPartialsTest.test("dust");
  require("./shared/dust").test("dust");
  sharedTest.test("handlebars");
  sharedPartialsTest.test("handlebars");
  sharedHelpersTest.test("handlebars");
  sharedTest.test("underscore");
  sharedPartialsTest.test("underscore");
  sharedTest.test("lodash");
  sharedTest.test("qejs");
  sharedTest.test("walrus");
  sharedTest.test("mustache");
  sharedPartialsTest.test("mustache");
  sharedTest.test("just");
  sharedTest.test("ect");
  sharedTest.test("mote");
  // haredTest.test("toffee"); // open something
  sharedTest.test("atpl");
  sharedTest.test("plates");
  sharedTest.test("templayed");
  sharedTest.test("twig");
  sharedTest.test("dot");
  sharedTest.test("ractive");
  sharedPartialsTest.test("ractive");
  sharedTest.test("nunjucks");
  sharedFiltersTest.test("nunjucks");
  sharedIncludesTest.test("nunjucks");
  sharedTest.test("htmling");
  sharedTest.test("vash");
  sharedHelpersTest.test("vash");
  sharedTest.test("slm");
  sharedTest.test("marko");
  sharedTest.test("bracket");
  sharedTest.test("teacup");
  sharedTest.test("velocityjs");
  sharedTest.test("razor");
  sharedTest.test("squirrelly");
  sharedPartialsTest.test("squirrelly");
  sharedHelpersTest.test("squirrelly");
  sharedTest.test("twing");

  require("./shared/react").test("react");
});
