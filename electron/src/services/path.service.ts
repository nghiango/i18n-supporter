import * as path from 'path';

export function joinPath(...paths: string[]): string {
  return path.join(paths.toString());
}
