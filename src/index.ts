import { dereference } from "swagger-parser";
import { Path, Spec } from "swagger-schema-official";
import express from "express";
import * as process from "process";
import jsf = require("json-schema-faker");

const app = express();

// Setup jsf options
jsf.option({
  failOnInvalidTypes: false,
  failOnInvalidFormat: false,
  fixedProbabilities: true,
  alwaysFakeOptionals: true,
  minItems: 0,
  maxItems: 10
});

/**
 * Entry point for swagger-fake-server
 * @param json
 * @param options
 */
export default async function run(jsonfile, options) {
  const host = options.host || process.env.HOST || "0.0.0.0";
  const port = options.port || process.env.PORT || 9000;

  // Parse swagger specs
  const spec = await dereference(jsonfile).catch(e => {
    throw e;
  });

  // Setup routing by spec
  setupEndpoints(spec);

  // Start express server on localhost
  app.listen(port, host, () => {
    console.log("Server listen to port", port);
  });
}

function setupEndpoints(spec: Spec) {
  for (const path in spec.paths) {
    const methods = spec.paths[path];
    setupMethods(path, methods);
  }
}

function setupMethods(filepath: string, methods: Path) {
  for (const method in methods) {
    const responses = methods[method].responses;
    const formattedPath = filepath.replace(/\{(.+?)\}/g, (_, $1) => `:${$1}`);
    console.info(`Register endpoint: [${method.toUpperCase()}] ${formattedPath}`);
    app[method](formattedPath, async (_req, res) => {
      const schema = responses[200].schema;
      console.log(jsf.generate(schema));
      console.log(schema);
      res.json(jsf.generate(schema));
    });
  }
}
