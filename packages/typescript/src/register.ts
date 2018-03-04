import { register } from "@foreman/api";
import { transform } from "./transform";

register({
  extensions: [".ts", ".tsx"],
  transform: (source, filename) => {
    return transform(source, {
      fileName: filename,
      compilerOptions: { sourceMap: true }
    });
  }
});
