import process from "process";
import commander from "commander";
import run from "..";

const pkg = require("../../package.json");

commander
  .version(pkg.version)
  .description("Run fake server by using a swagger schema")
  .command("run <file>")
  .action(async (filepath, _options) => {
    try {
      await run(filepath, {});
    } catch (e) {
      console.error(e);
      process.exit(2);
    }
  });

commander.parse(process.argv);
