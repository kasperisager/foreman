import { transform } from "../src/transform";
const { test } = require("tap");

test("transform", async (t: any) => {
  let code;
  try {
    code = transform("let foo: number = 2;");
  } catch (err) {
    return;
  }

  t.is(code.trim(), "var foo = 2;");
});
