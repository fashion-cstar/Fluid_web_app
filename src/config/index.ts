import tokenAbi from '../abi/Token.json'
import vestingAbi from '../abi/Vesting.json'
import stakingAbi from '../abi/Staking.json'
import lpPairAbi from '../abi/LPPair.json'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { FortmaticConnector } from './Fortmatic'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

export enum ChainId {
  Mainnet = 1,
  Rinkeby = 4
}

export const uniChainName: { [chainId in ChainId]?:string} = {
  [ChainId.Mainnet]: "mainnet",
  [ChainId.Rinkeby]: "rinkeby"
}

export const config = {
  networkId: ChainId.Rinkeby
}

export const ABI = {
  tokenAbi,
  vestingAbi,
  stakingAbi,
  lpPairAbi
}

export const TokenAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0x4Bd1B90C8d7D77b1924cF0e0bFC55548aFCCdF72"
}

export const VestingAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0xf8e8304163E94C9629eF7dba90A348aF86f31fE1"
}

export const StakingAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0xf01291457b982f6D599CA4eB56e6Ee8B83438EB3"
}

export const LPStakingAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0xD44DaF3af3894B670a9D13732Bc5e7F328364dA8"
}

export const NetworkName: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "Ethereum Mainnet",
  [ChainId.Rinkeby]: "Rinkeby Testnet"
}

export const ProviderUrl: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_ETH_RPC_KEY}`,
  [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_ETH_RPC_KEY}`
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const ADD_LIQUIDITY_LINK = `https://app.uniswap.org/#/add/v2/ETH/${TokenAddress[config.networkId]}?chain=${uniChainName[config.networkId]}`

const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 43113, 43114, 97, 56, 1287, 80001, 137, 128]
})

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: ProviderUrl[ChainId.Mainnet] ?? '',
    4: ProviderUrl[ChainId.Rinkeby] ?? '',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

export const walletlink = new WalletLinkConnector({
  url: ProviderUrl[config.networkId] ?? '',
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet.',
    href: null,
    color: '#6748FF',
    mobile: true
  }
}