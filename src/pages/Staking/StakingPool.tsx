/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  TextField
} from '@material-ui/core'
import { PoolInfo, UserInfo } from 'types'
import { useStaking, useWallet, useProcessing } from 'contexts'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'utils'
import { PrimaryButton } from 'components/PrimaryButton'
import { SecondaryButton } from 'components/SecondaryButton'
import { ADD_LIQUIDITY_LINK } from 'config'
import { useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('sm')]: {
      width: '280px'
    },
    [theme.breakpoints.up('sm')]: {
      width: '220px'
    },
  }
}))

interface IStakingPool {
  poolInfo: PoolInfo
  pid: number
}

export const StakingPool: React.FC<IStakingPool> = ({ poolInfo, pid }) => {
  const theme: any = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const matches = useMediaQuery('(min-width:450px)');
  const { getUserInfo, rewards, deposit, withdraw, claim, updatePoolList } = useStaking()
  const { getTokenBalance, account, updateTokenBalance } = useWallet()
  const stakeToken = pid === 0 ? 'FLD-ETH' : 'FLD'
  const [userInfo, setUserInfo] = useState<Maybe<UserInfo>>(null)
  const [value, setValue] = useState('')
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0))
  const [loading, setLoading] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isHarvesting, setIsHarvesting] = useState(false)
  const { setProcessing } = useProcessing()

  useEffect(() => {
    setProcessing(loading)
  }, [loading])

  const updateUserInfo = async () => {
    const res = await getUserInfo(pid)
    setUserInfo(res)
  }

  const updateDepositTokenBalance = async () => {
    if (account) {
      const res = await getTokenBalance(account, poolInfo.stakeToken)
      setTokenBalance(res)
    } else {
      setTokenBalance(BigNumber.from(0))
    }
  }

  useEffect(() => {
    if (account) {
      updateUserInfo()
      updateDepositTokenBalance()
    }
  }, [pid, poolInfo, account])

  const handleDeposit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setIsDepositing(true)
    const res = await deposit(pid, Number(value))
    updatePoolList()
    updateDepositTokenBalance()
    if (res) {
      setValue('')
    }
    setIsDepositing(false)
    setLoading(false)
  }

  const handleWithdraw = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setIsWithdrawing(true)
    const res = await withdraw(pid, Number(value))
    updatePoolList()
    updateDepositTokenBalance()
    if (res) {
      setValue('')
    }
    setIsWithdrawing(false)
    setLoading(false)
  }

  const handleHarvest = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setIsHarvesting(true)
    await claim(pid)
    updateTokenBalance()
    setIsHarvesting(false)
    setLoading(false)
  }

  const isValueCorrect = () => {
    return !isNaN(Number(value)) && Number(value) > 0
  }

  return (
    <>
      <div className='max-w-[510px] w-full rounded-[19px] bg-white shadow-lg'>
        <div className='h-[85px] flex justify-center items-center rounded-t-[19px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
          <span className='text-[#0A208F] text-[29px] font-semibold'>
            {stakeToken} Pool
          </span>
        </div>
        <div className='w-full p-5'>
          <TextField
            variant="outlined"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value !== '' ? Number(e.target.value) > 0 ? Number(e.target.value).toString() : e.target.value : '')}
            disabled={loading}
            style={{ width: '100%' }}
            margin="dense"
            inputProps={{ style: { fontSize: 42, color: '#3F3F3F', textAlign: 'center' } }} // font size of input text            
            InputLabelProps={{ style: { fontSize: 42, color: '#3F3F3F', textAlign: 'center' } }}
            onInput={(e: any) => {
              // e.target.value = Math.max(0, Number(e.target.value)).toString().slice(0, 12)                            
              if (Number(e.target.value) < 0) e.target.value = -Number(e.target.value)
            }}
          />
          <div className={`flex justify-between items-center gap-6 w-full mt-5 mb-3 ${matches ? 'flex-row' : 'flex-col px-8'}`}>
            <SecondaryButton
              onClick={handleDeposit}
              width={matches ? '220px' : '100%'}
              disabled={
                loading || !isValueCorrect() || parseEther(Number(value).toString()).gt(tokenBalance)
              }
              isLoading = {isDepositing}
            >
              {isDepositing?'Depositing...':'Deposit'}              
            </SecondaryButton>

            <PrimaryButton
              onClick={handleWithdraw}
              width={matches ? '220px' : '100%'}
              disabled={
                loading ||
                !isValueCorrect() ||
                parseEther(Number(value).toString()).gt(userInfo?.amount || BigNumber.from(0))
              }
              isLoading = {isWithdrawing}
            >
              {isWithdrawing?'Withdrawing...':'Withdraw'}              
            </PrimaryButton>
          </div>
          <div className='w-full sm:px-4'>
            <div className='w-full flex justify-between py-3 border-b border-[#CECECE]'>
              <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Your Balance</div>
              <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
                {formatEther(tokenBalance || BigNumber.from(0), undefined, 3, true)} {stakeToken}
              </div>
            </div>
            <div className='w-full flex justify-between py-3 border-b border-[#CECECE]'>
              <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Your Staked Amount</div>
              <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
                {formatEther(userInfo?.amount || BigNumber.from(0), undefined, 3, true)} {stakeToken}
              </div>
            </div>
            <div className='w-full flex justify-between py-3'>
              <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Reward Amount</div>
              <div className='text-[16px] md:text-[20px] text-[#676767] font-normal'>
                {formatEther(rewards[pid] || BigNumber.from(0), undefined, 3, true)} FLD
              </div>
            </div>
          </div>
          <div className={`w-full flex justify-center ${matches ? 'flex-row' : 'flex-col px-8'} justify-between gap-8 md:gap-0 items-center mt-1 mb-3`}>
            <div>
              {pid === 0 && (
                <a href={ADD_LIQUIDITY_LINK} target="_blank">
                  <span className='text-[18px] sm:ml-4 font-medium text-[#3FBCE9] underline underline-offset-4'>Add Liquidity</span>
                </a>
              )}
            </div>
            <SecondaryButton
              onClick={handleHarvest}
              width={matches ? '220px' : '100%'}
              disabled={loading || rewards.length > 0 && rewards[pid].lte(0)}
              isLoading = {isHarvesting}
            >
              {isHarvesting?'Harvesting...':'Harvest'}              
            </SecondaryButton>
          </div>
        </div>
      </div>
    </>
  )
}
