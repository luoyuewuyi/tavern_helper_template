import * as fs from 'fs';
import * as path from 'path';

function common_path(lhs: string, rhs: string) {
  const lhs_parts = lhs.split(path.sep);
  const rhs_parts = rhs.split(path.sep);
  for (let i = 0; i < Math.min(lhs_parts.length, rhs_parts.length); i++) {
    if (lhs_parts[i] !== rhs_parts[i]) {
      return lhs_parts.slice(0, i).join(path.sep);
    }
  }
  return lhs_parts.join(path.sep);
}

function glob_script_files() {
  const results: string[] = [];

  fs.globSync(`{示例,src}/**/index.{ts,tsx,js,jsx}`)
    .forEach(file => {
      const file_dirname = path.dirname(file);
      for (const [index, result] of results.entries()) {
        const result_dirname = path.dirname(result);
        const common = common_path(result_dirname, file_dirname);
        if (common === result_dirname) {
          return;
        }
        if (common === file_dirname) {
          results.splice(index, 1, file);
          return;
        }
      }
      results.push(file);
    });

  return results;
}

console.log(glob_script_files().filter(f => f.includes('仙路绿途')));
