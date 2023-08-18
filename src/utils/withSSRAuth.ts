import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from 'jwt-decode'
import { AuthTokenError } from "../errors/AuthTokenError";
import { validateUserPermissions } from "./validateUserPermissions";

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

type UserData = {
  permissions?: string[];
  roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['monipaep.token']

    if(!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        },
      }
    }

    if(options) {
      const { permissions, roles } = options

      const user = decode<UserData>(token)
      
      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions, 
        roles
      })

      if(!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (error) {
      if(error instanceof AuthTokenError) {
        destroyCookie(ctx, 'monipaep.token')
        destroyCookie(ctx, 'monipaep.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      } else {
        return {
          notFound: true
        }
      }
    }
  }
}