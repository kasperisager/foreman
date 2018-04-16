const del = require("del");

export function remove(path: string): Promise<void> {
  return del([path]).then(() => {});
}
