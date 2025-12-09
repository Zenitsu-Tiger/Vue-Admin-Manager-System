import useLoginStore from '@/store/login'
import { DEMO_MODE, isDemoPermission } from '@/global/demo-mode'

export default function usePermissions(permissionID: string) {
  // 演示模式下，对白名单内的权限直接放行
  if (DEMO_MODE && isDemoPermission(permissionID)) {
    return true
  }

  const loginStore = useLoginStore()
  const { permissions } = loginStore
  // !!代表转化为Boolean类型
  return !!permissions.find((item) => item.includes(permissionID))
}
