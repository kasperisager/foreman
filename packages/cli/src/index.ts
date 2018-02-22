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
      const args = [];

      args.push(script);

      if (argv._) {
        args.push(...argv._);
      }

      let node: string = "node";

      switch (path.extname(script)) {
        case ".ts":
        case ".tsx":
          node = "ts-node";
      }

      exec(node, args, { stdio: "inherit" })
        .then(({ code }) => {
          process.exit(code);
        })
        .catch(({ code }) => {
          process.exit(code);
        });
    }
  }
});
