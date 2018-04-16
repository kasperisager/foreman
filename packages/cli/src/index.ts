import * as path from "path";
const yargs = require("yargs");
const exec = require("execa");

const { argv } = yargs.command("* <script>", "", {
  builder: (argv: any) =>
    argv.positional("script", {
      description: "The script to execute"
    }),
  handler: (argv: any) => {
    const script = path.resolve(argv.script);

    if (script !== null) {
      const args = ["--require", require.resolve("@foreman/register")];

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
