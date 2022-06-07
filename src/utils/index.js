/**
 * 权限
 * @param {*} key
 */
export function hasPermission(key) {
  return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}
