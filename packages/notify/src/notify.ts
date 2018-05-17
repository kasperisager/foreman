import chalk from "chalk";

const { Signale } = require("signale");
const { ellipsis } = require("figures");

const logger = new Signale({
  types: {
    skip: {
      badge: ellipsis,
      color: "gray",
      label: "skipping"
    }
  }
});

logger.config({ displayTimestamp: true });

export interface Notification {
  readonly message: string;
  readonly value?: string;
  readonly type?: "info" | "success" | "error" | "warning" | "watch" | "skip";
  readonly error?: Error;
}

export function notify({
  message = "",
  value = "",
  type,
  error
}: Notification): void {
  value = chalk.dim(value);

  switch (type) {
    case "info":
    default:
      logger.info(message, value);
      break;
    case "success":
      logger.success(message, value);
      break;
    case "error":
      logger.error(message, value);
      if (error) {
        console.log(`\n${error.toString()}\n`);
      }
      break;
    case "warning":
      logger.warning(message, value);
      break;
    case "watch":
      logger.watch(message, value);
      break;
    case "skip":
      logger.skip(message, value);
  }
}
