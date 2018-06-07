import { extname } from "path";
import { getFileInfo } from "prettier";

export async function isSupported(path: string) {
  const { ignored } = await getFileInfo(path);
  return !ignored;
}
