import React, { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'utils'
import { useWallet, useApy, useStaking, useTokenPrice } from 'contexts'

export const Indicators = () => {
    const { tokenBalance, account } = useWallet()
    const { requestApyList } = useApy()
    const { requestPriceList } = useTokenPrice()
    const { poolList, getLPPoolReserves, getLPTotalSupply } = useStaking()
    const [apyList, setApyList] = useState<any[]>([])
    const [priceList, setPriceList] = useState<any[]>([])
    const [TVL, setTVL] = useState(0)
    const [lpPricePerFLD, setLPPricePerFLD] = useState(0)
    const [ETH2FLD_rate, setETH2FLDRate] = useState(1)

    const updateApyList = async () => {
        try {
            const res = await requestApyList()
            setApyList(res.apylist)
        } catch (err) {
            console.log(err)
        }
    }

    const updatePriceList = async () => {
        try {
            const res = await requestPriceList()
            setPriceList(res.pricelist)
        } catch (err) {
            console.log(err)
        }
    }

    const getLPPriceFromUniswapPair = async () => {
        try {
            let res = await getLPPoolReserves()
            let reserve0 = Number(formatEther(BigNumber.from(res[0]), undefined, 5, false))
            let reserve1 = Number(formatEther(BigNumber.from(res[1]), undefined, 5, false))
            res = await getLPTotalSupply()            
            let totalSupply = Number(formatEther(BigNumber.from(res), undefined, 5, false))
            let ethPrice = reserve0/reserve1
            let lpPerFld = 2*Math.sqrt(reserve0*reserve1)*Math.sqrt(ethPrice*1)/totalSupply
            setLPPricePerFLD(lpPerFld)
        } catch (err) {
            console.log(err)
        }
    }

    const getETH2FLD = async () => {
        try {
            let res = await getLPPoolReserves()
            let reserve0 = Number(formatEther(BigNumber.from(res[0]), undefined, 5, false))
            let reserve1 = Number(formatEther(BigNumber.from(res[1]), undefined, 5, false))            
            setETH2FLDRate(reserve1/reserve0)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        updateApyList()
        updatePriceList()
        getLPPriceFromUniswapPair()
        getETH2FLD()
    }, [])

    useEffect(() => {
        if (poolList.length>1 && priceList.length>0){
            let p0 = Number(formatEther(poolList[0].depositedAmount, undefined, 3, false))
            let p1 = Number(formatEther(poolList[1].depositedAmount, undefined, 3, false))
            let c = Math.sqrt((p0*p0)/ETH2FLD_rate) * 2  
            // lp amount => sqrt(ETH amount of pair * FLD amount of pair) 
            // ETH amount of pair = FLD amount of pair * ETH2FLD_rate
            // lp amount = sqrt(FLD amount of pair * ETH2FLD_rate * FLD amount of pair)
            // pow(FLD amount of pair, 2) = pow(lp amount, 2) / ETH2FLD_rate
            // FLD amount of pair = sqrt(pow(lp amount, 2) / ETH2FLD_rate)
            // in other words, lp amount is sum of ETH pair and FLD pair. $ of ETH pair = $ of FLD pair  $ of lp amount = $ of FLD pair * 2
            console.log(p0, p1, c, ETH2FLD_rate)            
            // let pool0 = Number(formatEther(poolList[0].depositedAmount, undefined, 3, false))*Number(priceList[0]?.price)*lpPricePerFLD                                    
            // let pool1 = Number(formatEther(poolList[1].depositedAmount, undefined, 3, false))*Number(priceList[0]?.price)            
            let t = (c+p1)*Number(priceList[0]?.price)            
            // setTVL(Math.round(pool0+pool1))
            setTVL(Math.round(t))
        }
    }, [priceList, poolList, lpPricePerFLD, ETH2FLD_rate])

    return (
        <div className="w-full flex flex-col px-6 md:px-0 items-center">
            <div className='mt-16 md:hidden'>
                <div className='text-[26px] font-semibold text-[#051C42] uppercase'>Staking/LP</div>
                <div className='bg-[#3FBCE9] h-0.5 w-full'></div>
            </div>
            <div className="w-full mt-12 md:mt-10 flex flex-col gap-8 xl:gap-12 xl:flex-row">
                <div className="w-full flex gap-8 xl:gap-12 flex-col md:flex-row basis-1/2">
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {apyList && apyList.length > 0 ? apyList[0].apy + '%' : '--'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'APR for LP'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {apyList && apyList.length > 1 ? apyList[1].apy + '%' : '--'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'APR on FLD staking'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex gap-8 xl:gap-12 flex-col md:flex-row  basis-1/2">
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {`$${TVL.toLocaleString()}`}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'Total Value Locked'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {account ? formatEther(tokenBalance || BigNumber.from(0), undefined, 1, true) + " FLD" : '---'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'Your FLD Balance'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
