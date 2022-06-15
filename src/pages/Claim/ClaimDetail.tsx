/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { useVesting, useWallet, useProcessing } from 'contexts'
import { useHistory } from 'react-router-dom'
import { formatTime, formatEther, parseEther } from 'utils'
import { VestingInfo, VestingType } from 'types'
import { VestedChart } from './VestedChart'
import { BigNumber } from 'ethers'
import { PrimaryButton } from 'components/PrimaryButton'

interface IClaimDetail {
  info: VestingInfo
}

export const ClaimDetail: React.FC<IClaimDetail> = ({ info }) => {
  const { tokenBalance } = useWallet()
  const { claim, getClaimAvailable, vestingTypes } = useVesting()
  const history = useHistory()

  const [type, setType] = useState<Maybe<VestingType>>(null)
  const [availableAmount, setAvailableAmount] = useState<BigNumber>(BigNumber.from(0))
  const [loading, setLoading] = useState(false)
  const { setProcessing } = useProcessing()

  useEffect(() => {
    setProcessing(loading)
  }, [loading])

  const nextClaim = Math.max(
    (info?.lastClaim || 0) +
    (type?.lockupDuration || 0) -
    Math.floor(new Date().getTime() / 1000),
    0
  )

  useEffect(() => {
    if (vestingTypes.length > info.typeId) {
      setType(vestingTypes[info.typeId])
    } else {
      setType(null)
    }
  }, [vestingTypes, info])

  const getAvailableAmount = useCallback(
    async (vestingId: number) => {
      const res = await getClaimAvailable(vestingId)
      setAvailableAmount(res)
    },
    [getClaimAvailable, info]
  )

  useEffect(() => {
    if (info) {
      getAvailableAmount(info.vestingId)
    }
  }, [info, getAvailableAmount])

  const handleClaim = async () => {
    setLoading(true)
    if (info) {
      await claim(info.vestingId)
    }
    setLoading(false)
  }

  return (
    <div className='w-full flex flex-col xl:flex-row gap-10 justify-center items-center rounded-[20px] bg-white shadow-xl p-6 lg:pl-8 lg:py-7'>
      <div className='max-w-[600px] xl:max-w-[380px] xl:max-w-[400px] w-full'>
        <div className='w-full'>
          <span className='text-[28px] font-medium text-[#0A208F]'>{type?.name || ''}</span>
        </div>
        <div className='w-full py-6'>
          <span className='text-[20px] font-normal text-[#3F3F3F] underline underline-offset-4'>View Instructions</span>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Total Amount</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(info.amount, undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Next Unlock In</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {info ? (nextClaim > 0 ? formatTime(nextClaim) : 'Available') : ''}
          </div>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Tokens Pending</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(info.amount.sub(info.claimedAmount), undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Tokens Claimed</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(info?.claimedAmount, undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Tokens Vested</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(info.claimedAmount.add(availableAmount), undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Available To Claim</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(availableAmount, undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-center py-2 border-b border-[#CECECE] mb-2'>
          <PrimaryButton
            onClick={handleClaim}
            width='250px'
            disabled={
              loading ||
              availableAmount.lte(0) ||
              nextClaim > 0 ||
              !info
            }
            isLoading = {loading}
          >
            {loading ? 'Claiming...' : 'Claim'}
          </PrimaryButton>
        </div>

        <div className='w-full flex justify-between py-1'>
          <div className='text-[16px] md:text-[20px] text-[#0A208F] font-medium'>Your Token Balance</div>
          <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
            {formatEther(tokenBalance, undefined, 3, true)}{' '}FLD
          </div>
        </div>

        <div className='w-full flex justify-center py-2'>
          <PrimaryButton
            width='250px'
            onClick={() => {
              history.push('/staking')
            }}
          >
            Stake
          </PrimaryButton>
        </div>

      </div>
      <VestedChart info={info} />
    </div>
  )
}
