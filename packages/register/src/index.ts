function register(pkg: string): void {
  try {
    require(`@foreman/${pkg}/register`);
  } catch (err) {}
}

register("babel");
register("typescript");
