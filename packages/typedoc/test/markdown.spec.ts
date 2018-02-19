import { reflect } from "../src/reflect";
import { markdown } from "../src/markdown";

const { test } = require("tap");

test("markdown", async (t: any) => {
  const reflection = await reflect(require.resolve("./fixtures/test.ts"));

  if (reflection === null) {
    return t.fail();
  }

  console.log(await markdown(reflection));
});
