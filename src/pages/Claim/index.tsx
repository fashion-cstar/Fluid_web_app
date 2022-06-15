/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ClaimList } from './ClaimList';

export const Claim = () => {
  return (
    <div className="w-full flex justify-center py-10 px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
      <div className="w-full max-w-[1620px] flex flex-col items-center gap-16 md:gap-20">
        <div className="w-full">
          <div className="mt-16 mb-4 md:hidden w-full flex justify-center">
            <div>
              <div className="text-[26px] font-semibold text-[#051C42] uppercase">Claiming</div>
              <div className="bg-[#3FBCE9] h-0.5 w-full"></div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[28px] text-[#0A208F] font-medium uppercase">Claiming</div>
          </div>
          <div className="text-[16px] md:text-[20px] text-center md:text-left font-normal text-[#3F3F3F] mt-2">
            If you have invested in FLUID, then you’re in the right place! FLUID’s claims portal
            will help visualize the total amount you have invested, at what round, and a timeline of
            vested available to claim versus total across the vested period. It will also allow you
            to claim your tokens into your preferred wallet.
          </div>
        </div>
        <ClaimList />
      </div>
    </div>
  );
};
