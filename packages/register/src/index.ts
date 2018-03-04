import { sourceMaps } from "@foreman/api";
const { install } = require("source-map-support");

install({
  environment: "node",
  retrieveSourceMap(filename: string) {
    const map = sourceMaps.get(filename);

    if (map) {
      return { url: filename, map };
    }

    return null;
  }
});

for (const pkg of ["babel", "typescript"]) {
  try {
    require(`@foreman/${pkg}/register`);
  } catch (err) {}
}
