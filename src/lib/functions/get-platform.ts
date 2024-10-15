function getOS() {
  const platform = window.navigator.platform,
    macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'MacOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  }
  return os;
}

export { getOS };