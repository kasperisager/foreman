const { install } = require("source-map-support");

const maps: Map<string, string> = new Map();

install({
  environment: "node",
  retrieveSourceMap(filename: string) {
    const map = maps.get(filename);

    if (map) {
      return { url: null, map };
    }

    return null;
  }
});

for (const pkg of ["babel", "typescript"]) {
  try {
    require(`@foreman/${pkg}/register`)(maps);
  } catch (err) {}
}
