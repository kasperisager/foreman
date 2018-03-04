import { register } from "@foreman/api";
import { transform } from "./transform";

register({
  extensions: [".ts", ".tsx"],
  transform: (code, fileName) => {
    return transform(code, { fileName });
  }
});
