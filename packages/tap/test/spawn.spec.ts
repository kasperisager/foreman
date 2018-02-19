import { spawn } from "../src/spawn";
const { test } = require("tap");

test("foo", async (t: any) => {
  const results = await spawn(require.resolve("./fixtures/test.ts"));

  console.log(results);
});
