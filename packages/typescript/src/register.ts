import { register } from "@foreman/api";
import { extension } from "@foreman/path";
import { Workspace } from "typecomp";
import { transform } from "./transform";

const workspace = new Workspace();

register({
  extensions: [".ts", ".tsx"],
  transform: (source, filename) => {
    const output = workspace.compile(filename);

    let code: string | undefined;
    let map: string | undefined;

    for (const { name, text } of output) {
      switch (extension(name)) {
        case ".js":
          code = text;
          break;
        case ".map":
          map = text;
      }
    }

    return code === undefined
      ? transform(source, { fileName: filename })
      : { code, map };
  }
});
