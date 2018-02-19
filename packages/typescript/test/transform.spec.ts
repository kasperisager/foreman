import { transform } from "../src/transform";
const { test } = require("tap");

test("transform", async (t: any) => {
  let code;
  try {
    code = await transform("const foo: number = 2/;");
  } catch (err) {
    console.log(err.frame);
    return;
  }

  t.is(code.trim(), "var foo = 2;");
});
