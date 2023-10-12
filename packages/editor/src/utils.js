export function isMacOS() {
  return navigator.userAgentData.platform === 'macOS';
}

export function preventNativeSave(e) {
  if (e.code === 'KeyS' && (isMacOS() ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
  }
}
