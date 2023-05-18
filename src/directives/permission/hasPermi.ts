import type { App } from 'vue'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { t } = useI18n() // 国际化

// binding.value 权限允许传如一个字符串或者一个字符串数组
export function hasPermi(app: App<Element>) {
  app.directive('hasPermi', (el, binding) => {
    const { wsCache } = useCache()
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = wsCache.get(CACHE_KEY.USER).permissions

    if (!value || (value instanceof Array && value.length === 0)) {
      throw new Error(t('permission.hasPermission'))
    }

    const permissionFlag = value instanceof Array ? value : [value] // 包装成数组

    const hasPermissions = permissions.some((permission: string) => {
      return all_permission === permission || permissionFlag.includes(permission)
    })
    // dev环境打开所有权限
    const openAllPermission = import.meta.env.VITE_DEV === 'true'

    if (!hasPermissions && !openAllPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  })
}
