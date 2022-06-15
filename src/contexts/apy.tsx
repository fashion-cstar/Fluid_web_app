/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import { reqOptionsAuthorized } from 'utils'
import { useSession } from './session'
export interface IApyContext {
    requestApyList: () => any
    requestUpdateApy: (id: string, apy: number, apyBefore: number) => any
    requestUpdateLogs: (id: string) => any
}

const ApyContext = React.createContext<Maybe<IApyContext>>(null)

export const ApyProvider = ({ children = null as any }) => {
    const { getUserToken } = useSession()

    const requestApyList = () => {
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/apylist', reqOptionsAuthorized(getUserToken(), 'post')
        ).then((res) => res.json())
    }

    const requestUpdateLogs = (id: string) => {
        const data = { id }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/log', reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    const requestUpdateApy = (id: string, apy: number, apyBefore: number) => {
        const data = { id, apy, apyBefore }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/updateapy',
            reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    return (
        <ApyContext.Provider
            value={{ requestApyList, requestUpdateApy, requestUpdateLogs }}
        >
            {children}
        </ApyContext.Provider>
    )
}

export const useApy = () => {
    const context = useContext(ApyContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
