import React, { useEffect, useState } from 'react'
import { Logo } from 'components/Logo'

export const Template = ({children}: {children?: React.ReactNode}) => {

    return (
        <div className="w-full bg-no-repeat bg-center bg-white md:bg-[url('./assets/images/signup/hero.png')]" style={{ minHeight: '100vh' }}>
            <div className="h-full w-full md:w-[720px] md:bg-[#FFFFFF]/70" style={{ minHeight: '100vh' }}>
                <div className="w-full bg-top bg-[url('./assets/images/signup/hero_mobile.png')] md:bg-none">
                    <div className='w-full flex flex-col justify-center items-center md:items-start gap-5 bg-[#FFFFFF]/70 md:bg-transparent pt-[70px] md:pt-[40px] pb-[90px] md:pb-[110px] px-8 md:px-20'>
                        <Logo />
                        <div className='text-[#36BBEB] text-[18px] font-semibold uppercase'>
                            LIQUIDITY AGGREGATION, TRANSFORMED
                        </div>
                    </div>
                </div>
                <div className="px-10 md:px-20 py-6 md:py-10">
                    {children}
                </div>
            </div>
        </div>
    )
}
