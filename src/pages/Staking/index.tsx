/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { StakingView } from './StakingView'
import { Indicators } from './Indicators'
export const Staking = () => {

  return (
    <div className="w-full flex justify-center py-10 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
      <div className='w-full max-w-[1620px] flex flex-col items-center gap-16 md:gap-20'>
        <Indicators />
        <StakingView />
      </div>
    </div>
  )
}
