import * as path from "path";
const yargs = require("yargs");
const exec = require("execa");

const { argv } = yargs.command("* <script>", "", {
  builder: (argv: any) =>
    argv
      .option("prof", {
        type: "boolean",
        description: "Generate profiler output"
      })
      .positional("script", {
        description: "Script to evaluate"
      }),
  handler: (argv: any) => {
    const script = path.resolve(argv.script);

    if (script !== null) {
      const args = ["--require", require.resolve("@foreman/register")];

      if (argv.prof) {
        args.push("--prof");
      }

      args.push(script);

      if (argv._) {
        args.push(...argv._);
      }

      exec("node", args, { stdio: "inherit" })
        .then((result: any) => {
          process.exit(result.code);
        })
        .catch((result: any) => {
          process.exit(result.code);
        });
    }
  }
});
