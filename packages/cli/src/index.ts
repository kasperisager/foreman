import * as path from "path";
import * as yargs from "yargs";
import * as exec from "execa";

type Loader = { module: string };

const TypeScript: Loader = {
  module: "ts-node/register"
};

const loaders: { [extension: string]: Loader } = {
  ".ts": TypeScript,
  ".tsx": TypeScript
};

export function loaderFor(file: string): string | null {
  const type = path.extname(file);

  if (type in loaders) {
    try {
      return require.resolve(loaders[type].module);
    } catch (err) {}
  }

  return null;
}

const { argv } = yargs.command("* <script>", "", {
  builder: argv =>
    argv.positional("script", {
      description: "The script to execute"
    }),
  handler: argv => {
    const script = path.resolve(argv.script);

    if (script !== null) {
      const loader = loaderFor(script);
      const args = [];

      if (loader) {
        args.push("--require", loader);
      }

      args.push(script);

      if (argv._) {
        args.push(...argv._);
      }

      exec("node", args, { stdio: "inherit" });
    }
  }
});
