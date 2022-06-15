import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { config, ABI, TokenAddress, VestingAddress, StakingAddress, ProviderUrl, LPStakingAddress } from 'config'
import { IContract } from 'types'
import { Contract } from 'web3-eth-contract'

export interface IContractContext {
  web3: Web3
  tokenContract: IContract
  vestingContract: IContract
  stakingContract: IContract
  lpPairContract: IContract
}

const ContractContext = React.createContext<Maybe<IContractContext>>(null)

const defaultWeb3 = new Web3((window as any).ethereum || ProviderUrl[config.networkId])

export const ContractProvider = ({ children = null as any }) => {
  const { library } = useWeb3React()

  const [web3, setWeb3] = useState<Web3>(defaultWeb3)
  const [tokenContract, setTokenContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(ABI.tokenAbi as any, TokenAddress[config.networkId])
  )
  const [vestingContract, setVestingContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(
      ABI.vestingAbi as any,
      VestingAddress[config.networkId]
    )
  )
  const [stakingContract, setStakingContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(
      ABI.stakingAbi as any,
      StakingAddress[config.networkId]
    )
  )
  const [lpPairContract, setLPPairContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(
      ABI.lpPairAbi as any,
      LPStakingAddress[config.networkId]
    )
  )
  useEffect(() => {
    const web3Obj = new Web3(library?.provider || ProviderUrl[config.networkId])
    setWeb3(web3Obj)
    setTokenContract(
      new web3Obj.eth.Contract(ABI.tokenAbi as any, TokenAddress[config.networkId])
    )
    setVestingContract(
      new web3Obj.eth.Contract(ABI.vestingAbi as any, VestingAddress[config.networkId])
    )
    setStakingContract(
      new web3Obj.eth.Contract(ABI.stakingAbi as any, StakingAddress[config.networkId])
    )
    setLPPairContract(
      new web3Obj.eth.Contract(ABI.lpPairAbi as any, LPStakingAddress[config.networkId])
    )
  }, [library])

  return (
    <ContractContext.Provider
      value={{
        web3,        
        tokenContract: {
          contract: tokenContract,
          address: TokenAddress[config.networkId] ?? '',
        },
        vestingContract: {
          contract: vestingContract,
          address: VestingAddress[config.networkId] ?? '',
        },
        stakingContract: {
          contract: stakingContract,
          address: StakingAddress[config.networkId] ?? '',
        },
        lpPairContract: {
          contract: lpPairContract,
          address: LPStakingAddress[config.networkId] ?? '',
        }
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContracts = () => {
  const context = useContext(ContractContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
