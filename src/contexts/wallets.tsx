/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useWeb3React } from '@web3-react/core'
import { toast } from 'react-toastify'
import { config, NetworkName, ABI, TokenAddress, ChainId, ProviderUrl } from '../config'
import { useLocalStorageState } from 'hooks'
import { useContracts } from './contracts'
import { BigNumber } from 'ethers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SUPPORTED_WALLETS } from '../config'

export interface IWalletContext {
  connected: boolean
  account: Maybe<string>
  balance: BigNumber
  tokenBalance: BigNumber
  chainId: Maybe<number>
  connect: (connector: AbstractConnector, key: string) => void
  disconnect: () => void
  updateBalance: () => void
  updateTokenBalance: () => void
  getTokenBalance: (
    userAddress: string,
    tokenAddress: string
  ) => Promise<BigNumber>
}

const WalletContext = React.createContext<Maybe<IWalletContext>>(null)

export const WalletProvider = ({ children = null as any }) => {
  const { web3 } = useContracts()
  const { activate, deactivate, active, chainId, account } = useWeb3React()

  const [walletType, setWalletType] = useLocalStorageState('wallet_type', '')
  const [connected, setConnected] = useState<boolean>(false)
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))

  const connect = useCallback(
    async (connector: AbstractConnector, key: string) => {
      try {
        activate(connector, undefined, true).then(res => {
          setWalletType(key)
        }).catch(error => {
          toast.error('Wallet connect failed!')
          console.log("Error: "+error)
        })        
      } catch (err) {
        toast.error('Wallet connect failed!')
      }
    },
    [activate, setWalletType]
  )

  const disconnect = async () => {
    await deactivate()
    setWalletType(null)
  }

  useEffect(() => {
    if (walletType) {
      const option= SUPPORTED_WALLETS[walletType]
      if (option?.connector) connect(option.connector, walletType)
    }
  }, [connect, activate, walletType])

  useEffect(() => {
    if (active) {
      if (chainId) {
        if (chainId === config.networkId) {
          setConnected(true)
        } else {
          deactivate()
          let win:any=window
          let ethereum = win.ethereum
          if (ethereum) {
            const hexChainId = '0x' + Number(config.networkId).toString(16)
            const tx =
              ethereum && ethereum.request
                ? ethereum['request']({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChainId }] }).catch()
                : ''
                console.log(tx)
            if (tx !== '') {
              tx
                .then((t:any) => {  
                  setConnected(true)                           
                  setTimeout(() => {
                    window.location.reload()
                  }, 100)
                })

            }else{
              toast.error(`Please connect ${NetworkName[config.networkId]}!`)
            }
          }
          
        }
      }
    } else {
      setConnected(false)
    }
  }, [active, chainId, deactivate])

  const updateBalance = useCallback(async () => {
    if (account) {
      const res = await web3.eth.getBalance(account)
      setBalance(BigNumber.from(res))
    } else {
      setBalance(BigNumber.from(0))
    }
  }, [account])

  const updateTokenBalance = useCallback(async () => {
    if (account) {
      const tokenContract = new web3.eth.Contract(
        ABI.tokenAbi as any,
        TokenAddress[config.networkId]
      )

      try {
        const res = await tokenContract.methods.balanceOf(account).call()
        setTokenBalance(BigNumber.from(res))
      } catch (err: any) {
        console.error(err)
      }
    } else {
      setTokenBalance(BigNumber.from(0))
    }
  }, [account])

  useEffect(() => {
    updateBalance()
    updateTokenBalance()
  }, [account])

  const getTokenBalance = async (userAddress: string, tokenAddress: string) => {
    const tokenContract = new web3.eth.Contract(
      ABI.tokenAbi as any,
      tokenAddress
    )

    try {
      const res = await tokenContract.methods.balanceOf(userAddress).call()
      return BigNumber.from(res)
    } catch (err: any) {
      console.error(err)
    }
    return BigNumber.from(0)
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        balance,
        tokenBalance,
        chainId,
        connect,
        disconnect,
        updateBalance,
        updateTokenBalance,
        getTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
