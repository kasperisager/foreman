import chalk from "chalk";
import { isSourceError } from "@foreman/error";

const wsk = require("wsk-notify");

export interface Notification {
  readonly message: string;
  readonly value?: string;
  readonly type?:
    | "compile"
    | "watch"
    | "error"
    | "change"
    | "add"
    | "reload"
    | "success"
    | "remove"
    | "serve";
  readonly desktop?: boolean;
  readonly error?: Error;
}

export function notify({
  message = "",
  value = "",
  type,
  desktop = true,
  error
}: Notification): void {
  let output: string = wsk({
    message,
    value,
    display: type,
    extend: {
      desktop
    },
    silent: true
  });

  if (type === "error" && error) {
    let message: string = "";

    if (isSourceError(error)) {
      message += `\n${error}`;
    } else {
      message += `\n${chalk.dim(error.stack)}`;
    }

    output += "\n" + message;
  }

  console.log(output);
}
