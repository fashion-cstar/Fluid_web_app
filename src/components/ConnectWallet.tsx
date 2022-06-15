/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import { WalletModal } from './WalletModal'

export const ConnectWallet = ({width = "227px"}: {width: string}) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {        
        setIsOpen(false)
    }
    return (
        <div>
            <WalletModal isOpen={isOpen} handleClose={handleClose} />
            <PrimaryButton onClick={() => setIsOpen(true)} width={width}>
                Connect Wallet
            </PrimaryButton>
        </div>
    )
}
