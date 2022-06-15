import { Contract } from 'web3-eth-contract'
import { BigNumber } from 'ethers'

export interface IContract {
  contract: Contract
  address: string
}

// export enum WalletType {
//   MetaMask = 'metamask',
//   WalletConnect = 'walletconnect',
//   Coinbase = 'coinbase',
//   Fortmatic = 'fortmatic'
// }

export interface PoolInfo {
  stakeToken: string
  rewardPerBlock: BigNumber
  depositedAmount: BigNumber
}

export interface UserInfo {
  amount: BigNumber
  rewardDebt: BigNumber
  pendingRewards: BigNumber
}

export interface VestingType {
  typeId: number
  name: string
  startTime: number
  endTime: number
  lockupDuration: number
  maxAmount: BigNumber
  vestedAmount: BigNumber
  vestingFrequencyId: number
}

export interface VestingInfo {
  typeId: number
  vestingId: number
  recipient: string
  amount: BigNumber
  claimedAmount: BigNumber
  lastClaim: number
}

export interface VestingId {
  typeId: number
  vestingId: number
}

export interface VestingEventFromBlockLog {
  timestamp: number
  topic: string
  amount: string
}

export interface VestingTypeEventFromBlockLog {
  timestamp: number
  topic: string
  data: {
    name: string
    startTime: number
    endTime: number
    lockupDuration: number
    maxAmount: string
    vestingFrequencyId: number
  }
}

export interface VestingEvent {
  action: number
  typeId: number
  typeName: string
  vestingId: number
  wallet: string
  amount: number
  updatedBy: any
  createdAt: Date
  updatedAt: Date
}

export interface VestingTypeEvent {
  action: number
  typeId: number
  name: string
  startTime: Date
  endTime: Date
  lockupDuration: number
  amount: number
  vestingFrequencyId: number
  updatedBy: any
  createdAt: Date
  updatedAt: Date
}

export interface IImportWalletList {
  typeId: string
  recipient: string
  amount: BigNumber
  data: string
}

export interface IWalletList {
  typeId: string
  recipient: string
  amount: BigNumber
}

export interface IWalletError {
  data: string
  error: string
}

export interface IUpdateVestingList {
  vestingId: string
  recipient: string
  amount: BigNumber
}

export const VF_LIST = [
  { value: 0, label: "Continuous" },
  { value: 1, label: "Daily" },
  { value: 2, label: "Weekly" },
  { value: 3, label: "Monthly" },
  { value: 4, label: "Quarterly" },
  { value: 5, label: "Yearly" },
]
