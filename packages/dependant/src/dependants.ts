import * as crypto from "crypto";
import { DepGraph as Graph } from "dependency-graph";
import { some } from "micromatch";

export interface MatchOptions {
  include?: string | Array<string>;
  exclude?: string | Array<string>;
}

export interface DependantsOptions extends MatchOptions {}
export interface TraverseOptions extends MatchOptions {}

export class Dependants {
  private readonly graph: Graph<never> = new Graph();
  private readonly options: DependantsOptions;

  public constructor(options: DependantsOptions = {}) {
    this.options = options;
  }

  public add(name: string): boolean {
    if (!this.has(name) && this.matches(name, this.options)) {
      this.graph.addNode(name);
      return true;
    }

    return false;
  }

  public has(name: string): boolean {
    return this.graph.hasNode(name);
  }

  public link(from: string, to: string): boolean {
    if (
      this.has(from) &&
      this.matches(from) &&
      this.has(to) &&
      this.matches(to)
    ) {
      this.graph.addDependency(from, to);
      return true;
    }

    return false;
  }

  public async traverse(
    callback: (name: string) => void | Promise<void>,
    options: TraverseOptions = {}
  ): Promise<void> {
    for (const name of this.graph.overallOrder()) {
      if (this.matches(name, options)) {
        await callback(name);
      }
    }
  }

  protected matches(
    input: string,
    options: MatchOptions = this.options
  ): boolean {
    if (options.include && !some(input, options.include)) {
      return false;
    }

    if (options.exclude && some(input, options.exclude)) {
      return false;
    }

    return true;
  }
}
