/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useSession, useVesting, useWallet } from 'contexts'
import { getShortWalletAddress } from 'utils'
import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import { PrimaryButton } from 'components/PrimaryButton'
import { SecondaryButton } from 'components/SecondaryButton'
import { useHistory, useLocation } from 'react-router-dom'
import { ConnectWallet } from './ConnectWallet'
import { ADD_LIQUIDITY_LINK } from 'config'
import { ChangePassword } from './ChangePassword'

export const Header = () => {
  const history = useHistory()
  const location = useLocation()
  const { connected, account, connect, disconnect } = useWallet()
  const { requestUserSignout, checkAuthentication, getUserName } = useSession()
  const { isVestingAdmin } = useVesting()
  const [isOpen, setIsOpen] = useState(false)
  const [pathname, setPathname] = useState(location.pathname)
  const [isOpenCP, setIsOpenCP] = useState(false)
  history.listen((location) => { setPathname(location.pathname) })

  const userSignOut = () => {
    disconnect()
    requestUserSignout()
    window.location.reload()
  }

  const changePassword = () => {
    setIsOpenCP(true)
  }

  const handleCloseCP = () => {
    setIsOpenCP(false)
  }

  const NavMenu = () => {
    return (
      <div className='flex gap-10 px-7 pt-4 pb-2.5 rounded-[16px] bg-white'>
        <Link to="/staking">
          <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Staking/LP</span>
          <div className={`bg-[#3FBCE9] h-0.5 w-full ${pathname.includes('staking') ? 'block' : 'hidden'}`}></div>
        </Link>
        <Link to="/claiming">
          <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Claiming</span>
          <div className={`bg-[#3FBCE9] h-0.5 w-full ${pathname.includes('claiming') ? 'block' : 'hidden'}`}></div>
        </Link>
        <a href={ADD_LIQUIDITY_LINK} target="_blank">
          <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Add Liquidity</span>
          <div className={`bg-[#3FBCE9] h-0.5 w-full ${pathname.includes('swap') ? 'block' : 'hidden'}`}></div>
        </a>
        <Link to="/lend">
          <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Lend</span>
          <div className={`bg-[#3FBCE9] h-0.5 w-full ${pathname.includes('lend') ? 'block' : 'hidden'}`}></div>
        </Link>
        {isVestingAdmin && (
          <Link to="/admin">
            <span className='text-[18px] text-[#051C42] font-semibold uppercase'>Admin</span>
            <div className={`bg-[#3FBCE9] h-0.5 w-full ${pathname.includes('admin') ? 'block' : 'hidden'}`}></div>
          </Link>)}
      </div>
    )
  }

  const SideMenu = () => {
    return (
      <div className={`w-[280px] right-0 top-0 bg-white shadow-lg z-10 ${isOpen ? 'fixed' : 'hidden'}`}>
        <div className='flex flex-col px-6 py-8 bg-white'>
          <div className='w-full flex justify-end'>
            <div className='cursor-pointer' onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="19.473" height="19.473" viewBox="0 0 19.473 19.473">
                <g id="Group_2741" data-name="Group 2741" transform="translate(-348.456 -22.585)">
                  <path id="Path_1136" data-name="Path 1136" d="M-2163.129,15066l16.643,16.645" transform="translate(2513 -15042)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                  <path id="Path_1137" data-name="Path 1137" d="M0,0,16.643,16.644" transform="translate(366.514 24) rotate(90)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>
          {connected && <div className='py-4 border-b border-[#C2C2C2]'>
            <div className='flex gap-6 items-center cursor-pointer'>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <div className='flex flex-col'>
                <div className='text-[#303030] text-[26px] font-bold'>
                  {checkAuthentication() && (
                    <>{getUserName()}</>
                  )}
                </div>
                <div className='text-[#303030] text-[16px] font-normal'>
                  {getShortWalletAddress(account || '')}
                </div>
              </div>
            </div>
          </div>}
          <div className='py-4 border-b border-[#C2C2C2]'>
            <Link to="/staking">
              <span className={`text-[18px] text-[#051C42] ${pathname.includes('staking') ? 'font-semibold' : 'font-normal'} uppercase`}>Staking/LP</span>
            </Link>
          </div>
          <div className='py-4 border-b border-[#C2C2C2]'>
            <Link to="/claiming">
              <span className={`text-[18px] text-[#051C42] ${pathname.includes('claiming') ? 'font-semibold' : 'font-normal'} uppercase`}>Claiming</span>
            </Link>
          </div>
          <div className='py-4 border-b border-[#C2C2C2]'>
            <a href={ADD_LIQUIDITY_LINK} target="_blank">
              <span className={`text-[18px] text-[#051C42] font-normal uppercase`}>Add Liquidity</span>
            </a>
          </div>
          <div className='py-4 border-b border-[#C2C2C2]'>
            <Link to="/lend">
              <span className={`text-[18px] text-[#051C42] ${pathname.includes('lend') ? 'font-semibold' : 'font-normal'} uppercase`}>Lend</span>
            </Link>
          </div>
          {isVestingAdmin && (
            <div className='py-4 border-b border-[#C2C2C2]'>
              <Link to="/admin">
                <span className={`text-[18px] text-[#051C42] ${pathname.includes('admin') ? 'font-semibold' : 'font-normal'} uppercase`}>Admin</span>
              </Link>
            </div>)}
          <div className='py-4 border-b border-[#C2C2C2]'>
            <div className={`text-[18px] text-[#051C42] uppercase cursor-pointer`} onClick={() => changePassword()}>Change Password</div>
          </div>
          <div className='py-4 border-b border-[#C2C2C2]'>
            <div className={`text-[18px] text-[#051C42] uppercase cursor-pointer`} onClick={userSignOut}>Sign Out</div>
          </div>
          {!connected ? <div className='mt-10 w-full flex justify-center'>
            <ConnectWallet width="227px" />
          </div> :
            <div className='mt-10 w-full flex justify-center'>
              <SecondaryButton onClick={() => disconnect()}>
                Disconnect Wallet
              </SecondaryButton>
            </div>}
        </div>
      </div>
    )
  }

  return (
    <>
      <ChangePassword isOpen={isOpenCP} handleClose={handleCloseCP} />
      <div className="w-full px-4 flex justify-between lg:justify-around items-center pt-6 md:pt-8 flex-wrap">
        <div className='flex items-center justify-center'>
          <div className='hidden md:block'>
            <img src="/images/logo_full_medium.svg" alt="FLUID" />
          </div>
          <div className='md:hidden'>
            <img src="/images/logo_full_mobile.svg" alt="FLUID" />
          </div>
        </div>
        <div className='flex justify-center items-center py-2 pl-4 pr-2 bg-white rounded-l-full md:hidden cursor-pointer' onClick={() => setIsOpen(true)}>
          <svg id="Group_896" data-name="Group 896" xmlns="http://www.w3.org/2000/svg" width="58" height="34" viewBox="0 0 58 34">
            <line id="Line_72" data-name="Line 72" x1="27" transform="translate(10 8)" fill="none" stroke="#0b1b40" strokeLinecap="round" strokeWidth="3" />
            <line id="Line_73" data-name="Line 73" x1="18" transform="translate(19 16)" fill="none" stroke="#0b1b40" strokeLinecap="round" strokeWidth="3" />
            <line id="Line_74" data-name="Line 74" x1="27" transform="translate(10 24)" fill="none" stroke="#0b1b40" strokeLinecap="round" strokeWidth="3" />
            <rect id="Rectangle_231" data-name="Rectangle 231" width="58" height="34" fill="#fff" opacity="0" />
          </svg>
        </div>
        <SideMenu />
        <div className='hidden lg:block flex gap-8 items-center'>
          <NavMenu />
        </div>
        <div className='hidden md:block'>
          {connected ? (
            <div className="dropdown flex flex-col justify-end">
              <div className='flex gap-6 items-center cursor-pointer'>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <div className='flex flex-col'>
                  <div className='text-[#303030] text-[26px] font-bold'>
                    {checkAuthentication() && (
                      <>{getUserName()}</>
                    )}
                  </div>
                  <div className='text-[#303030] text-[16px] font-normal'>
                    {getShortWalletAddress(account || '')}
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="15.475" height="8.586" viewBox="0 0 15.475 8.586">
                  <path id="Vector_4" data-name="Vector 4" d="M0,0,6.889,6.889,0,13.778" transform="translate(14.626 0.849) rotate(90)" fill="none" stroke="#303030" strokeLinecap="round" strokeWidth="1.2" />
                </svg>
              </div>

              <div className="dropdown-content">
                <div className='mt-2 rounded-xl bg-[#F9F9F9] py-2 px-6 shadow-lg'>
                  <div className='text-[20px] text-black font-normal cursor-pointer py-1' onClick={() => changePassword()}>Change Password</div>
                  <div className='border-b border-black' />
                  <div className='text-[20px] text-black font-normal cursor-pointer py-1' onClick={() => disconnect()}>Disconnect Wallet</div>
                  <div className='border-b border-black' />
                  <div className='text-[20px] text-black font-normal cursor-pointer py-1' onClick={userSignOut}>Sign Out</div>
                </div>
              </div>
            </div>
          ) : (
            <ConnectWallet width="227px" />
          )}
        </div>
      </div>
      <div className='hidden md:block lg:hidden mt-4'>
        <div className='w-full flex justify-center'>
          <NavMenu />
        </div>
      </div>
    </>
  )
}
