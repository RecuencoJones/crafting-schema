export async function verifyPermission(fileHandle) {
  const options = {
    mode: 'readwrite'
  };

  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return;
  }
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return;
  }

  throw new Error('Cannot open file');
}
