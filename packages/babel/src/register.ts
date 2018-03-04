import { register } from "@foreman/api";
import { transform } from "./transform";

let maps: Map<string, string> | null = null;

register({
  extensions: [".js", ".jsx"],
  transform: (source, filename) => {
    const { code, map } = transform(source, { filename, sourceMaps: true });

    if (map && maps) {
      maps.set(filename, map);
    }

    return code;
  }
});

export default function(external: Map<string, string>): void {
  maps = external;
}
