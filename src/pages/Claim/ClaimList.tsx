/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { ClaimDetail } from './ClaimDetail'
import { useVesting, useWallet } from 'contexts'

export const ClaimList = () => {
  const { account } = useWallet()
  const { vestingList } = useVesting()
  const userVestingList = vestingList.filter(
    (item) =>
      item.recipient.toLowerCase() === account?.toLowerCase() && item.amount.gt(0)
  )

  return (
    <div className='w-full flex flex-col gap-12 md:gap-16'>      
      {userVestingList.map((info, index) => (
        <ClaimDetail info={info} key={index} />
      ))}
    </div>
  )
}
