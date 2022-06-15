/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {    
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core'
import PaperComponent from 'components/DraggableModalPaper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SUPPORTED_WALLETS } from '../config'
import { useWallet } from 'contexts'

interface IWalletModal {
    isOpen: boolean
    // selectConnector: (connector: AbstractConnector) => void
    handleClose: () => void
}

export const WalletModal = ({ isOpen, /* selectConnector,*/ handleClose }: IWalletModal) => {
    const { connect } = useWallet()

    const handleSelectWallet = (connector: AbstractConnector | undefined, key:string) => {
        if (connector) connect(connector, key)
    }

    return (
        <div>
            <Dialog
                onClose={() => handleClose()}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
                PaperComponent={PaperComponent}
                PaperProps={{ style: { borderRadius: '24px', background: 'transparent linear-gradient(134deg, #F3E8FF 0%, #FCFEFF 34%, #E8F9FF 100%) 0% 0% no-repeat padding-box' } }}
            >
                {/* <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"> */}
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    <div className='px-8 md:px-10 pt-8 md:pt-10'>
                        <div className='flex justify-between gap-6 md:gap-10'>
                            <div className='text-[24px] font-semibold text-[#474747]'>Connect a Wallet</div>
                            <div className='cursor-pointer hidden md:block' onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="19.473" height="19.473" viewBox="0 0 19.473 19.473">
                                    <g id="Group_2741" data-name="Group 2741" transform="translate(-348.456 -22.585)">
                                        <path id="Path_1136" data-name="Path 1136" d="M-2163.129,15066l16.643,16.645" transform="translate(2513 -15042)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                                        <path id="Path_1137" data-name="Path 1137" d="M0,0,16.643,16.644" transform="translate(366.514 24) rotate(90)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className='text-[18px] font-normal text-[#474747] mt-2'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='w-full flex flex-col gap-5 px-8 md:px-10 pb-8 md:pb-10'>
                        {Object.keys(SUPPORTED_WALLETS).map(key => {
                            const option = SUPPORTED_WALLETS[key]
                            return (
                                <div key={key} className='w-full flex justify-between items-center px-4 md:px-5 h-[60px] md:h-[67px] bg-white rounded-[12px] cursor-pointer hover:border-slate-400 hover:border' onClick={() => handleSelectWallet(option.connector, key)}>
                                    <div className='text-[18px] font-medium text-[#050025]'>{option.name}</div>
                                    <div>
                                        <img width='35px' src={`./images/wallet/${option.iconName}`} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
