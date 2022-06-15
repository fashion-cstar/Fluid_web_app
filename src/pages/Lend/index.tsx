/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

export const Lend = () => {

    return (
        <div className="w-full flex justify-center py-8 px-6 lg:px-8 xl:px-16 2xl:px-[124px] mt-10 md:mt-4">
            <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-12'>
                <div className='w-full flex justify-center gap-4'>
                    <div className='flex items-center justify-center gap-4'>
                        <div className='hidden md:block'>
                            <img src="/images/fluid_logo.svg" alt="FLUID" width='36px' />
                        </div>
                        <div className='block md:hidden'>
                            <img src="/images/fluid_logo.svg" alt="FLUID" width='26px' />
                        </div>
                        <div className='text-[40px] md:text-[60px] text-[#051C42] font-semibold'>FLUID</div>
                    </div>
                    <div className='text-[40px] md:text-[60px] text-[#051C42] font-semibold'>LEND</div>
                </div>
                <div className='text-[25px] md:text-[40px] font-medium text-[#051C42] uppercase'>Coming soon</div>
                <div className='w-full text-[18px] md:text-[24px] text-[#051C42] text-center'>
                    FLUID users will be able to borrow stablecoin by using $FLD as collateral, or lend $FLD for margin to earn APY.<br />
                    The solution is peer-to-peer based and made possible through the FLUID ecosystem. There are 2 main solutions users can leverage:<br />
                    <br />
                    <span className='font-semibold'>FLUID Stable Lend</span> will provide users with a stablecoin loan of up to 25% of the collateralized value at the time that the FLD is deposited. The fees are dependent on the loan term that can be up to 1 year.<br />
                    <br />
                    <span className='font-semibold'>FLUID Margin</span> will allow our users to use leverage on <span className='font-semibold'>FLUID Trades</span>
                </div>
            </div>
        </div>
    )
}