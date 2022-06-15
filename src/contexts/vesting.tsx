/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from 'ethers'
import React, { useEffect, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { VestingEventFromBlockLog, VestingTypeEventFromBlockLog, VestingInfo, VestingType, IWalletList, IUpdateVestingList } from 'types'
import { useContracts } from './contracts'
import { useWallet } from './wallets'
import { parseEther, parseVestingTypeData } from 'utils'
export interface IVestingContext {
  isVestingAdmin: boolean
  vestingTypes: VestingType[]
  vestingList: VestingInfo[]
  claim: (vestingId: number) => void
  getClaimAvailable: (vestingId: number) => Promise<BigNumber>
  getVestingFrequency: (vfId: number) => Promise<number>
  addVestingType: (
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => Promise<boolean>
  updateVestingType: (
    typeId: number,
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => Promise<boolean>
  addVesting: (
    typeId: number,
    recipient: string,
    amount: number
  ) => Promise<boolean>
  updateVesting: (
    vestingId: number,
    recipient: string,
    amount: number
  ) => Promise<boolean>
  addUpdateMultiVesting: (
    _addVestingList: IWalletList[],
    _updateVestingList: IUpdateVestingList[]
  ) => Promise<boolean>
  getEvents: (typeId: number, vestingId: number, address: string) => Promise<VestingEventFromBlockLog[]>
  getTypeEvents: (typeId: number) => Promise<VestingTypeEventFromBlockLog[]>
  eventTopics: { [id: string]: string }
}

const VestingContext = React.createContext<Maybe<IVestingContext>>(null)

export const VestingProvider = ({ children = null as any }) => {
  const { vestingContract, web3 } = useContracts()
  const { account } = useWallet()

  const [isVestingAdmin, setVestingAdmin] = useState(false)
  const [vestingTypes, setVestingTypes] = useState<VestingType[]>([])
  const [vestingList, setVestingList] = useState<VestingInfo[]>([])
  const { updateTokenBalance } = useWallet()

  const eventTopics: { [id: string]: string } = {
    '0x41e2396a6e9c1acf60ed38dcf04ccf13d4de214df6bb8499fe002b4909865212': 'Add Amount',
    '0x165c12094c1f9f8266d89897df9a046ab1a4718d06238f3952ec1f367336851a': 'Update Amount',
    '0xaf27d723038cb53553cb7f48a969ed95217fa6f4fdddc612c06792fb0ea9f0ce': 'Add Vesting Type',
    '0xaf870d609b13b8b808d0daa3d7141d2df9ff51d246b451cd03ecb6cca53df89d': 'Update Vesting Type',
  }

  useEffect(() => {
    updateAdminInfo()
    updateVestingTypes()
    updateVestingList()
  }, [account])

  const updateAdminInfo = async () => {
    if (account) {
      try {
        const res = await vestingContract.contract.methods
          .isAdmin(account)
          .call()
        setVestingAdmin(res)
      } catch (err) {
        console.error(err)
        setVestingAdmin(false)
      }
    } else {
      setVestingAdmin(false)
    }
  }

  const updateVestingTypes = async () => {
    let typeCount = 0
    try {
      typeCount = await vestingContract.contract.methods.typeCount().call()
    } catch (err) {
      console.error(err)
    }

    if (Number(typeCount) > 0) {
      const promises = new Array(Number(typeCount))
        .fill(0)
        .map((_, typeId) =>
          vestingContract.contract.methods.typeList(typeId).call()
        )
      try {
        await Promise.all(promises).then(async (res) => {
          setVestingTypes(
            res.map((item, typeId) => ({
              typeId,
              name: String(item[0]),
              startTime: Number(item[1]),
              endTime: Number(item[2]),
              lockupDuration: Number(item[3]),
              maxAmount: BigNumber.from(item[4]),
              vestedAmount: BigNumber.from(item[5]),
              vestingFrequencyId: Number(item[6])
            }))
          )
        })
      } catch (e) {
        console.error('get vesting type error:', e)
      }
    } else {
      setVestingTypes([])
    }
  }

  const updateVestingList = async () => {
    let vestingCount = 0
    try {
      vestingCount = await vestingContract.contract.methods
        .vestingCount()
        .call()
    } catch (err) {
      console.error(err)
    }

    if (Number(vestingCount) > 0) {
      const promises = new Array(Number(vestingCount))
        .fill(0)
        .map((_, vestingId) =>
          vestingContract.contract.methods.vestingList(vestingId).call()
        )
      try {
        const res = await Promise.all(promises)
        setVestingList(
          res.map(
            (item, vestingId) =>
            ({
              typeId: Number(item[0]),
              vestingId,
              recipient: String(item[1]).toLowerCase(),
              amount: BigNumber.from(item[2]),
              claimedAmount: BigNumber.from(item[3]),
              lastClaim: Number(item[4]),
            } as VestingInfo)
          )
        )
      } catch (e) {
        console.error('get vesting list error:', e)
        setVestingList([])
      }
    } else {
      setVestingList([])
    }
  }

  const claim = async (vestingId: number) => {
    try {
      await vestingContract.contract.methods
        .claim(vestingId)
        .send({ from: account })
      toast.success('Claimed successfully')
      updateVestingList()
      updateTokenBalance()
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
  }

  const getClaimAvailable = async (vestingId: number) => {
    try {
      const res = await vestingContract.contract.methods
        .claimAvailable(vestingId)
        .call()
      return BigNumber.from(res)
    } catch (err) {
      console.error(err)
    }
    return BigNumber.from(0)
  }

  const getVestingFrequency = async (vfId: number) => {
    try {
      const res = await vestingContract.contract.methods
        .vestingFrequencyList(vfId)
        .call()
      return Number(res)
    } catch (err) {
      console.error(err)
    }
    return 0
  }

  const addVestingType = async (
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => {
    try {
      await vestingContract.contract.methods
        .addVestingType(
          name,
          start,
          end,
          lockupDuration,
          parseEther(maxAmount.toString(), undefined),
          vestingFrequencyId
        )
        .send({ from: account })
      toast.success('Added successfully')
      updateVestingTypes()
      return true
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
    return false
  }

  const updateVestingType = async (
    typeId: number,
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => {
    try {
      await vestingContract.contract.methods
        .updateVestingType(
          typeId,
          name,
          start,
          end,
          lockupDuration,
          parseEther(maxAmount.toString(), undefined),
          vestingFrequencyId
        )
        .send({ from: account })
      toast.success('Updated successfully')
      updateVestingTypes()
      return true
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
    return false
  }

  const addVesting = async (
    typeId: number,
    recipient: string,
    amount: number
  ) => {
    try {
      await vestingContract.contract.methods
        .addVesting(typeId, recipient, parseEther(amount.toString(), undefined),)
        .send({ from: account })
      toast.success('Added successfully')
      updateVestingTypes()
      updateVestingList()
      return true
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
    return false
  }

  const updateVesting = async (
    vestingId: number,
    recipient: string,
    amount: number
  ) => {
    try {
      await vestingContract.contract.methods
        .updateVesting(vestingId, recipient, parseEther(amount.toString(), undefined))
        .send({ from: account })
      toast.success('Updated successfully')
      updateVestingTypes()
      updateVestingList()
      return true
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
    return false
  }

  const addUpdateMultiVesting = async (
    _addVestingList: IWalletList[],
    _updateVestingList: IUpdateVestingList[]
  ) => {
    try {
      await vestingContract.contract.methods
        .addUpdateMutiVesting(_addVestingList, _updateVestingList)
        .send({ from: account })
      toast.success('Updated successfully')
      updateVestingTypes()
      updateVestingList()
      return true
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }
    return false
  }

  const getEvents = async (typeId: number, vestingId: number, address: string) => {
    let addEvents: VestingEventFromBlockLog[] = [], updateEvents: VestingEventFromBlockLog[] = []
    let typeIdHex = web3.utils.toHex(typeId)
    let vestingIdHex = web3.utils.toHex(vestingId)
    typeIdHex = web3.utils.padLeft(typeIdHex, 64)
    vestingIdHex = web3.utils.padLeft(vestingIdHex, 64)
    let addressHex = web3.utils.padLeft(address, 64)

    try {
      // add vesting history
      let res = await fetch(
        `${process.env.REACT_APP_ETHERSCAN_URL
        }?module=logs&action=getLogs&fromBlock=${10389525}&toBlock=latest&address=${vestingContract.address
        }&topic0=0x41e2396a6e9c1acf60ed38dcf04ccf13d4de214df6bb8499fe002b4909865212&topic1=${typeIdHex}&topic2=${addressHex}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
      ).then((res) => res.json())
      if (res && res.status === '1') {
        addEvents = res.result.map(
          (item: any) =>
          ({
            timestamp: web3.utils.hexToNumber(item.timeStamp),
            topic: item.topics[0],
            amount: web3.utils.hexToNumberString(item.topics[3])
          } as VestingEventFromBlockLog)
        )
      }
      // update vesting history
      res = await fetch(
        `${process.env.REACT_APP_ETHERSCAN_URL
        }?module=logs&action=getLogs&fromBlock=${10389525}&toBlock=latest&address=${vestingContract.address
        }&topic0=0x165c12094c1f9f8266d89897df9a046ab1a4718d06238f3952ec1f367336851a&topic1=${vestingIdHex}&topic2=${addressHex}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
      ).then((res) => res.json())
      if (res && res.status === '1') {
        updateEvents = res.result.map(
          (item: any) =>
          ({
            timestamp: web3.utils.hexToNumber(item.timeStamp),
            topic: item.topics[0],
            amount: web3.utils.hexToNumberString(item.topics[3])
          } as VestingEventFromBlockLog)
        )
      }
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }

    return addEvents.concat(updateEvents)
  }

  const getTypeEvents = async (typeId: number) => {
    let addEvents: VestingTypeEventFromBlockLog[] = [], updateEvents: VestingTypeEventFromBlockLog[] = []

    let typeIdHex = web3.utils.toHex(typeId)
    typeIdHex = web3.utils.padLeft(typeIdHex, 64)
    try {
      // add vesting types
      let res = await fetch(
        `${process.env.REACT_APP_ETHERSCAN_URL
        }?module=logs&action=getLogs&fromBlock=${10389525}&toBlock=latest&address=${vestingContract.address
        }&topic0=0xaf27d723038cb53553cb7f48a969ed95217fa6f4fdddc612c06792fb0ea9f0ce&topic1=${typeIdHex}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
      ).then((res) => res.json())
      if (res && res.status === '1') {
        addEvents = res.result.map(
          (item: any) =>
          ({
            timestamp: web3.utils.hexToNumber(item.timeStamp),
            topic: item.topics[0],
            data: parseVestingTypeData(item.data, web3)
          } as VestingTypeEventFromBlockLog)
        )
      }

      // update vesting types
      res = await fetch(
        `${process.env.REACT_APP_ETHERSCAN_URL
        }?module=logs&action=getLogs&fromBlock=${10389525}&toBlock=latest&address=${vestingContract.address
        }&topic0=0xaf870d609b13b8b808d0daa3d7141d2df9ff51d246b451cd03ecb6cca53df89d&topic1=${typeIdHex}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
      ).then((res) => res.json())
      if (res && res.status === '1') {
        console.log('updateevents', res)
        updateEvents = res.result.map(
          (item: any) =>
          ({
            timestamp: web3.utils.hexToNumber(item.timeStamp),
            topic: item.topics[0],
            data: parseVestingTypeData(item.data, web3)
          } as VestingTypeEventFromBlockLog)
        )
      }
    } catch (error) {
      let err:any = error
      console.error(err)
      toast.error(err.data?.message || err?.message || err)
    }

    return addEvents.concat(updateEvents)
  }

  return (
    <VestingContext.Provider
      value={{
        isVestingAdmin,
        vestingTypes,
        vestingList,
        claim,
        getClaimAvailable,
        getVestingFrequency,
        addVestingType,
        updateVestingType,
        addVesting,
        updateVesting,
        addUpdateMultiVesting,
        getEvents,
        getTypeEvents,
        eventTopics,
      }}
    >
      {children}
    </VestingContext.Provider>
  )
}

export const useVesting = () => {
  const context = useContext(VestingContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
