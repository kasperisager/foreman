import { register } from "@foreman/api";
import { transform } from "./transform";

let maps: Map<string, string> | null = null;

register({
  extensions: [".ts", ".tsx"],
  transform: (source, filename) => {
    const { code, map } = transform(source, {
      fileName: filename,
      compilerOptions: { sourceMap: true }
    });

    if (map && maps) {
      maps.set(filename, map);
    }

    return code;
  }
});

export default function(external: Map<string, string>): void {
  maps = external;
}
