import fs from 'fs';

export function checkFileExistsSync(filepath: string): boolean {
  let flag = false;
  const folderExists = checkIfFolderExists(filepath);
  if (folderExists) {
    try {
      fs.accessSync(filepath, fs.constants.F_OK);
      flag = true;
    } catch (e) {
      flag = false;
    }
  }
  return flag;
}

function checkIfFolderExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function chunkArray(addressArray: string[], chunk_size = 4): string[][] {
  const results: string[][] = [];
  while (addressArray.length) {
    results.push(addressArray.slice(0, chunk_size));
  }
  return results;
}
