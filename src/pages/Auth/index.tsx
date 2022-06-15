import React, { useEffect, useState } from 'react'
import { Signup } from './Signup'
import { Signin } from './Signin'
import { useParams } from 'react-router'
import { PrimaryButton } from 'components/PrimaryButton'
import { useSession } from 'contexts'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Template } from './Template'
import { ForgotPassword } from './ForgotPassword'
import { useHistory } from 'react-router-dom'

export const Auth = () => {
    const history = useHistory()
    const { verifyCode } = useParams<{ verifyCode: string }>()
    const [isSignUp, setIsSignUp] = useState(true)
    const [isRegistered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [isUnderProcess, setUnderProcess] = useState(false)
    const [isForgotPassword, setForgotPassword] = useState(false)
    const [isLogined, setLogined] = useState(false)
    const [isNotVerifiedEmail, setNotVerifiedEmail] = useState(false)
    const { requestResendVerification, requestVerify } = useSession()

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await requestVerify(verifyCode)
                if (res.errors) {
                    history.push('/')
                    toast.error(`Invalid verification code! User not found`)
                } else {
                    setRegistered(true)
                    setUnderProcess(true)
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (verifyCode) {
            if (verifyCode.length>0) fetch()
        }
    }, [verifyCode])

    const handleResend = async (e: any) => {
        e.preventDefault()
        try {
            const res = await requestResendVerification(registeredEmail)
            if (res.errors) {
                console.log(res.errors)
            } else {
                if (res.action === 'success') {
                    toast.success("Verification link has been sent!")
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handleSendSignUp = (email: string) => {
        setRegisteredEmail(email)
        setRegistered(true)
    }
    return (
        <Template>
            {isForgotPassword ? <>
                <div className='w-full h-full flex flex-col items-center'>
                    <div className='w-full md:w-[440px]'>
                        <ForgotPassword />
                    </div>
                </div>
            </> : <>
                {!isRegistered && !isLogined ? <div className='w-full h-full flex flex-col items-center'>
                    <div className='w-full md:w-[440px]'>
                        <div className='w-full flex justify-center'>
                            <div className='flex w-[310px] md:w-[392px] border rounded-[5px] border-[#050025]'>
                                {isSignUp ? <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 rounded-[4px] bg-[#050025] text-white text-[18px] font-semibold uppercase'>Sign Up</div> :
                                    <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 text-[18px] font-normal text-[#051C42] cursor-pointer uppercase' onClick={() => setIsSignUp(true)}>Sign Up</div>}
                                {!isSignUp ? <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 rounded-[4px] bg-[#050025] text-white text-[18px] font-semibold uppercase'>Login</div> :
                                    <div className='w-[154px] md:w-[196px] flex justify-center items-center py-4 md:py-5 text-[18px] font-normal text-[#051C42] cursor-pointer uppercase' onClick={() => setIsSignUp(false)}>Login</div>}
                            </div>
                        </div>
                        {isSignUp && <Signup setIsSignUp={setIsSignUp} handleSendSignUp={handleSendSignUp} />}
                        {!isSignUp && <Signin setIsSignUp={setIsSignUp} setLogined={setLogined} setNotVerifiedEmail={setNotVerifiedEmail} setUnderProcess={setUnderProcess} setForgotPassword={setForgotPassword} setRegistered={setRegistered} />}
                    </div>
                </div> : <>
                    {!isUnderProcess && isRegistered && <div className='w-full flex flex-col mt-24 md:mt-0 gap-8 justify-center items-center'>
                        <div className='text-[28px] font-500 text-[#474747] text-center'>{!isNotVerifiedEmail ? 'Thank you for registering.' : 'Your email is yet to be verified.'}</div>
                        <div className='text-[18px] text-[#474747] text-center'>
                            An email has been sent to activate your account.<br />
                            Please click the link to activate your account.
                        </div>
                        <div className='mt-4'>
                            <PrimaryButton onClick={handleResend} width='275px'>
                                Resend Verification
                            </PrimaryButton>
                        </div>
                        <Link to="/">
                            <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
                        </Link>
                    </div>}
                    {isUnderProcess && isRegistered && <div className='w-full flex flex-col mt-24 md:mt-0 gap-8 justify-center items-center'>
                        <div className='text-[28px] font-500 text-[#474747] text-center'>Your verification is under process.</div>
                        <div className='text-[18px] text-[#474747] text-center'>
                            Your email has been confirmed!<br />
                            Please wait for approval.
                        </div>
                        <Link to="/">
                            <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
                        </Link>
                    </div>}
                </>}
            </>}
        </Template>
    )
}
