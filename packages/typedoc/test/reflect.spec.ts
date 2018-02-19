import { reflect } from "../src/reflect";

const { test } = require("tap");

test("reflect", async (t: any) => {
  console.log(await reflect(require.resolve("./fixtures/test.ts")));
});
