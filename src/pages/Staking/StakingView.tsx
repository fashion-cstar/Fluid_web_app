/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useStaking } from 'contexts';
import { StakingPool } from './StakingPool';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    padding: '1rem',
    boxSizing: 'border-box',
    border: '1px solid black',
    borderRadius: 8,
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  progress: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const StakingView = () => {
  const classes = useStyles();
  const { poolList, updatePoolList } = useStaking();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      await updatePoolList();
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="w-full rounded-[20px] bg-white shadow-xl p-6 lg:px-16 lg:py-7">
      <div className="w-full">
        <div className="text-[28px] text-[#0A208F] font-medium uppercase">STAKING/LP</div>
        <div className="text-[16px] md:text-[20px] font-normal text-[#3F3F3F] mt-2">
          Staking with FLUID could not be more accessible and beneficial. By Staking $FLD, you are
          instantly rewarded with reduced fees and earn rewards compounded daily into more $FLD. The
          rewards earned is dynamic and is based on supply versus demand.
        </div>
      </div>
      {!isLoading ? (
        <div className="flex flex-col xl:flex-row justify-center items-center gap-10 xl:gap-[110px] mt-10 mb-8">
          {poolList.map((poolInfo, pid) => (
            <StakingPool poolInfo={poolInfo} pid={pid} key={pid} />
          ))}
        </div>
      ) : (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};
