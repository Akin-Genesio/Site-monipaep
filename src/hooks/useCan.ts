import { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { validateUserPermissions } from '../utils/validateUserPermissions';

interface UseCanParams {
  permissions?: string[];
  roles?: string[];
  isUsm?: boolean;
}

export function useCan({ permissions = [], roles = [], isUsm = false }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if(!isAuthenticated) {
    return false
  }

  if(user) {
    if(!isUsm) {
      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions, 
        roles
      })
    
      return userHasValidPermissions
    } else {
      if(user.roles.includes("general.admin") || user.user.department === "USM") {
        return true
      } else {
        return false
      }
    }
  }

  return false
}