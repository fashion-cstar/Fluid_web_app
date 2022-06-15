/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import { reqOptionsAuthorized } from 'utils'
import { useSession } from './session'

export interface IVestingLogContext {    
    requestSaveAmountLog: (
        action: number,
        typeId: number,
        typeName: string,
        wallet: string,
        amount: number
    ) => any
    requestSaveTypeLog: (
        action: number,
        typeId: number,
        name: string,
        startTime: Date,
        endTime: Date,
        lockPeriod: number,
        vestingFrequency: number,
        amount: number
    ) => any
    requestVestingAmountLogs: (typeId: number, wallet: string) => any
    requestVestingTypeLogs: (typeId: number) => any  
    eventTypeTopics: string[]
    eventVestingTopics: string[]
}

const VestingLogContext = React.createContext<Maybe<IVestingLogContext>>(null)

export const VestingLogProvider = ({ children = null as any }) => {    
    const { getUserToken } = useSession()
    const eventTypeTopics: string[] = ['Add Vesting Type', 'Update Vesting Type']
    const eventVestingTopics: string[] = ['Add Amount', 'Update Amount']

    const requestVestingAmountLogs = (typeId: number, wallet: string) => {
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/vesting/vestingamount_log', reqOptionsAuthorized(getUserToken(), 'post', { typeId: typeId, wallet: wallet.toLowerCase() })
        ).then((res) => res.json())
    }

    const requestVestingTypeLogs = (typeId: number) => {
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/vesting/vestingtype_log', reqOptionsAuthorized(getUserToken(), 'post', { typeId: typeId })
        ).then((res) => res.json())
    }

    const requestSaveAmountLog = (
        action: number,
        typeId: number,
        typeName: string,
        wallet: string,
        amount: number) => {

        const data = { action: action, typeId: typeId, typeName: typeName, wallet: wallet, amount: amount }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/vesting/save_amountlog', reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    const requestSaveTypeLog = (
        action: number,
        typeId: number,
        name: string,
        startTime: Date,
        endTime: Date,
        lockupDuration: number,
        vestingFrequencyId: number,
        amount: number) => {

        const data = { action: action, typeId: typeId, name: name, startTime: new Date(startTime), endTime: new Date(endTime), lockupDuration: lockupDuration, vestingFrequencyId: vestingFrequencyId, amount: amount }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/vesting/save_typelog', reqOptionsAuthorized(getUserToken(), 'post', data as any)
        ).then((res) => res.json())
    }

    return (
        <VestingLogContext.Provider
            value={{ requestSaveAmountLog, requestSaveTypeLog, requestVestingAmountLogs, requestVestingTypeLogs, eventTypeTopics, eventVestingTopics }}
        >
            {children}
        </VestingLogContext.Provider>
    )
}

export const useVestingLog = () => {
    const context = useContext(VestingLogContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
