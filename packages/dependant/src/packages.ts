import * as path from "path";
import * as fs from "fs";
import * as resolveFrom from "resolve-from";
import { Dependants, TraverseOptions } from "./dependants";

const { keys, assign } = Object;

export interface Package {
  readonly directory: string;
}

export class Packages extends Dependants {
  public add(name: string): boolean {
    if (!this.has(name) && this.matches(name)) {
      try {
        const pkg = require(path.join(process.cwd(), name, "package.json"));

        super.add(name);

        for (const dependency of dependencies(pkg)) {
          this.add(dependency);
          this.link(name, dependency);
        }

        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }
}

function dependencies(manifest: any): Array<string> {
  return keys(assign({}, manifest.dependencies, manifest.devDependencies)).map(
    module =>
      path.relative(
        process.cwd(),
        path.dirname(
          resolveFrom(process.cwd(), path.join(module, "package.json"))
        )
      )
  );
}
