type User = {
  permissions?: string[];
  roles?: string[];
}

type ValidateUserPermissionParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validateUserPermissions({
  user, 
  permissions = [], 
  roles = []
}: ValidateUserPermissionParams) {
  if(permissions.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return user?.permissions?.includes(permission)
    })

    if(!hasAllPermissions) {
      return false
    }
  }

  if(roles.length > 0) {
    const hasEnoughRoles = roles.some(role => {
      return user?.roles?.includes(role)
    })

    if(!hasEnoughRoles) {
      return false
    }
  }

  return true
}