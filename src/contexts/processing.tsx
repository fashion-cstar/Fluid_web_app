/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'

export interface IProcessingContext {
    isProcessing: boolean
    setProcessing: (value: boolean) => void    
}

const ProcessingContext = React.createContext<Maybe<IProcessingContext>>(null)

export const ProcessingProvider = ({ children = null as any }) => {
    const [isProcessing, setIsProcessing] = useState(false)    

    const setProcessing = (value: boolean) => {
        setIsProcessing(value)
    }

    return (
        <ProcessingContext.Provider
            value={{ isProcessing, setProcessing }}
        >
            {children}
        </ProcessingContext.Provider>
    )
}

export const useProcessing = () => {
    const context = useContext(ProcessingContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
