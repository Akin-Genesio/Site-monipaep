import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from '../errors/AuthTokenError'

let isRefreshing = false
let failedRequestsQueue: any = []

interface setupAPIClientProps {
  ctx?: GetServerSidePropsContext
}

export function setupAPIClient(ctx?: any) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://monipaep.icmc.usp.br:80',
    headers: {
      Authorization: `Bearer ${cookies['monipaep.token']}`
    }
  })

  api.interceptors.request.use(response => {
    return new Promise(resolve => setTimeout(() => resolve(response), 750))
  })
  
  api.interceptors.response.use(response => {
    return response
  }, (error: AxiosError) => {
    if(error.response?.status === 401) {
      if(error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx)
        const { 'monipaep.refreshToken': refreshToken } = cookies
        const originalConfig = error.config
  
        if(!isRefreshing) {
          isRefreshing = true
  
          api.post('/refreshtoken', {
            refreshToken
          }).then(response => {
            const { token, 'refreshToken': newRefreshToken } = response.data
    
            setCookie(ctx, 'monipaep.token', token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })
      
            setCookie(ctx, 'monipaep.refreshToken', newRefreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })
    
            api.defaults.headers['Authorization'] = `Bearer ${token}`
  
            failedRequestsQueue.forEach((request: any) => request.onSuccess(token))
            failedRequestsQueue = []
          }).catch(error => {
            failedRequestsQueue.forEach((request: any) => request.onFailure(error))
            failedRequestsQueue = []
            
            if(process.browser) {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false
          })
        }
  
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`
              resolve(api(originalConfig))
            },
            onFailure: (error: AxiosError) => {
              reject(error)
            }
          })
        })
      } else if (
        error.response.data?.code === "refresh.token.invalid"   ||
        error.response.data?.code === "refresh.token.deletion"  ||
        error.response.data?.code === "refresh.token.expired"   ||
        error.response.data?.code === "refresh.token.creation"  ||
        error.response.data?.code === "refresh.token.generation"||
        error.response.data?.code === "token.not.found"         ||
        error.response.data?.code === "token.invalid"           
        ) {
        if(process.browser) {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      } 
    }
  
    return Promise.reject(error)
  })

  return api
}