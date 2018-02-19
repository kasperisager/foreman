import { watch, stat } from "@foreman/fs";
import { createLanguageService, diagnose } from "./src";

const service = createLanguageService();

async function main() {
  const watcher = await watch(
    "src/**/*.ts",
    ["add", "change"],
    async (event, path) => {
      console.time("Diagnose");
      const diagnotics = diagnose(service, path);
      console.timeEnd("Diagnose");
      console.log(diagnotics);
    }
  );

  watcher.close();
}

main();
