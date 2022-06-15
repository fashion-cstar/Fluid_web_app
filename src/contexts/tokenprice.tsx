/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import { reqOptionsAuthorized } from 'utils'
import { useSession } from './session'
export interface ITokenPriceContext {
    requestPriceList: () => any
    requestUpdatePrice: (id: string, price: number, priceBefore: number) => any
    requestUpdateLogs: (id: string) => any
}

const TokenPriceContext = React.createContext<Maybe<ITokenPriceContext>>(null)

export const TokenPriceProvider = ({ children = null as any }) => {
    const { getUserToken } = useSession()

    const requestPriceList = () => {
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/price/pricelist', reqOptionsAuthorized(getUserToken(), 'post')
        ).then((res) => res.json())
    }

    const requestUpdateLogs = (id: string) => {
        const data = { id }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/price/log', reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    const requestUpdatePrice = (id: string, price: number, priceBefore: number) => {
        const data = { id, price, priceBefore }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/price/updateprice',
            reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    return (
        <TokenPriceContext.Provider
            value={{ requestPriceList, requestUpdatePrice, requestUpdateLogs }}
        >
            {children}
        </TokenPriceContext.Provider>
    )
}

export const useTokenPrice = () => {
    const context = useContext(TokenPriceContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
