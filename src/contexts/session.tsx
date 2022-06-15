/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from 'react'
import { reqOptionsAuthorized } from 'utils'
import jwt from 'jsonwebtoken'

export interface ISessionContext {
  setUserSession: (_token: string, _name: string, _email: string, _id: string) => void
  requestUserSignin: (email: string, password: string, rememberMe: boolean) => Promise<any>
  requestUserSignup: (
    email: string,
    password: string,
    name: string
  ) => Promise<any>
  requestUserChangePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<any>
  requestResendVerification: (
    email: string
  ) => Promise<any>
  requestForgotCode: (
    email: string
  ) => Promise<any>
  requestVerifyForgotCode: (
    forgotCode: string
  ) => Promise<any>
  requestVerify: (
    verifyCode: string
  ) => Promise<any>
  requestResetPassword: (
    token: string,
    email: string,
    newPassword: string
  ) => Promise<any>
  requestUserSignout: () => void
  requestUserList: () => any
  requestUpdatePermit: (id: string, email: string, name: string, permit: number) => any
  checkAuthentication: () => boolean
  getUserToken: () => string
  getUserName: () => string
}

const SessionContext = React.createContext<Maybe<ISessionContext>>(null)

export const SessionProvider = ({ children = null as any }) => {

  const options = (method = 'get', data = {}) => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      body: method.toLowerCase() === 'get' ? null : JSON.stringify(data)
    }
  }

  const getUserToken = () => {
    return sessionStorage.getItem("jwtToken") ?? ''
  }

  const getUserName = () => {
    return sessionStorage.getItem("username") ?? ''
  }

  const setUserSession = (_token: string, _name: string, _email: string, _id: string) => {
    sessionStorage.setItem("jwtToken", _token)
    sessionStorage.setItem("username", _name)
    sessionStorage.setItem("useremail", _email)
    sessionStorage.setItem("userid", _id)
  }

  const requestUserSignin = (email: string, password: string, rememberMe: boolean) => {
    const data = { email, password }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/signin',
      options('post', data as any)
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.errors) {
          setUserSession(res.user.token, res.user.name, res.user.email, res.user._id)
          if (rememberMe) {
            localStorage.setItem('jwtToken', res.user.token)
          }
        }
        return res
      })
  }

  const requestUserList = () => {
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/userlist', reqOptionsAuthorized(getUserToken(), 'post')
    )
      .then((res) => res.json())
  }

  const requestUpdatePermit = (id: string, email: string, name: string, permit: number) => {
    const data = { id, email, name, permit }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/updatepermit',
      reqOptionsAuthorized(getUserToken(), 'post', data)
    ).then((res) => res.json())
  }

  const requestUserSignup = (email: string, password: string, name: string) => {
    const data = { email, password, name }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/signup',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestUserChangePassword = (currentPassword: string, newPassword: string) => {
    const data = { currentPassword, newPassword }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/changepassword',
      reqOptionsAuthorized(getUserToken(), 'post', data as any)
    ).then((res) => res.json())
  }

  const requestResendVerification = (email: string) => {
    const data = { email }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/resendverification',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestForgotCode = (email: string) => {
    const data = { email }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/forgotpassword',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestVerifyForgotCode = (forgotCode: string) => {
    const data = { forgotCode }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/verify_forgot',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestVerify = (verifyCode: string) => {
    const data = { verifyCode }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/verify',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestResetPassword = (token: string, email: string, newPassword: string) => {
    const data = { email, newPassword }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/resetpassword',
      reqOptionsAuthorized(token, 'post', data as any)
    ).then((res) => res.json())
  }

  const requestUserSignout = () => {
    sessionStorage.setItem("jwtToken", '')
    localStorage.setItem('jwtToken', '')
    localStorage.setItem('wallet_type', '')
  }

  const requestUserInfo = (token: string) => {
    fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/user',
      reqOptionsAuthorized(token, 'get')
    ).then((res) => res.json())
      .then(res => {
        setUserSession(token, res.user.name, res.user.email, res.user._id)
      }).catch(console.error)
  }

  const checkAuthentication = () => {
    let jwtToken = sessionStorage.getItem("jwtToken")
    if (jwtToken) {
      try {
        let token = jwt.decode(jwtToken)
        if (token) return true
        else return false
      } catch (err) {
        return false
      }
    } else {
      jwtToken = localStorage.getItem('jwtToken')
      if (jwtToken) {
        try {
          let token = jwt.decode(jwtToken)
          if (token) {
            requestUserInfo(jwtToken)
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      }else{
        return false
      }
    }
  }

  return (
    <SessionContext.Provider
      value={{ setUserSession, requestUserSignin, requestUserSignup, requestUserChangePassword, requestResendVerification, requestUserSignout, requestForgotCode, requestVerifyForgotCode, requestVerify, requestResetPassword, requestUserList, requestUpdatePermit, checkAuthentication, getUserToken, getUserName }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
