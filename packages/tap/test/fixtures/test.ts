const { test } = require("tap");

test("pass", async (t: any) => {
  t.is("foo", "foo", "Foo should be foo");
});

test("fail", async (t: any) => {
  t.is("foo", "bar", "Foo should not be bar");
});

test("skip", { skip: "Should not run" }, async (t: any) => {
  t.fail();
});
