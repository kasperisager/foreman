import { register } from "@foreman/api";
import { transform } from "./transform";

register({
  extensions: [".js", ".jsx"],
  transform: (code, filename) => {
    return transform(code, { filename });
  }
});
