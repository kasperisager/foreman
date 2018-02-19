import { dirname } from "path";
import * as fs from "fs";
import * as makeDir from "make-dir";

export function write(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) =>
    makeDir(dirname(path)).then(err => {
      if (err) {
        reject(err);
      } else {
        fs.writeFile(path, data, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    })
  );
}
