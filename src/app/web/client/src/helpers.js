export function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getPageName() {
  return ucFirst(window.location.pathname.split('/')[1])
}

export function sanitizeBody (resourceBody) {
  const cloneBody = { ...resourceBody }
  for (const field in resourceBody) {
    if (resourceBody.hasOwnProperty(field) && !resourceBody[field]) {
      delete cloneBody[field]
    }
  }
  return cloneBody
}