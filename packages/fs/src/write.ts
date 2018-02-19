import { dirname } from "path";
import * as fs from "fs";
import * as makeDir from "make-dir";

export function write(path: string, data: string): Promise<void> {
  return makeDir(dirname(path)).then(
    () =>
      new Promise<void>((resolve, reject) => {
        fs.writeFile(path, data, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
  );
}
