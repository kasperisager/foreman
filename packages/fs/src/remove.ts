import * as del from "del";

export function remove(path: string): Promise<void> {
  return del([path]).then(() => {});
}
