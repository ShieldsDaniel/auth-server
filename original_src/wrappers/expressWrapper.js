// @ts-check
const express = require("express");

/** @type { import("express-serve-static-core").Express } */
let app;

/**
 * @typedef ExpressWrapper
 * @property { function(): import("express-serve-static-core").Express } app
 * @property { (options?: import("body-parser").OptionsJson) => import("connect").NextHandleFunction } json
 */

/**
 * @returns { ExpressWrapper }
 */
const expressWrapper = {
  app: () => {
    if (typeof app === "undefined") {
      app = express();
    }
    return app;
  },
  json: express.json,
};

module.exports = expressWrapper;
