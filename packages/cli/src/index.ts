import * as path from "path";
import * as yargs from "yargs";
import * as exec from "execa";

const { argv } = yargs.command("* <script>", "", {
  builder: argv =>
    argv.positional("script", {
      description: "The script to execute"
    }),
  handler: argv => {
    const script = path.resolve(argv.script);

    if (script !== null) {
      const args = ["--require", require.resolve("@foreman/register")];

      args.push(script);

      if (argv._) {
        args.push(...argv._);
      }

      exec("node", args, { stdio: "inherit" })
        .then(({ code }) => {
          process.exit(code);
        })
        .catch(({ code }) => {
          process.exit(code);
        });
    }
  }
});
