export function getQueryParameter(name: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
