import { register } from "@foreman/api";
import { transform } from "./transform";

register({
  extensions: [".js", ".jsx"],
  transform: (source, filename) => {
    return transform(source, { filename, compact: false });
  }
});
