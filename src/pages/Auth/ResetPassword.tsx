import React, { useEffect, useState } from 'react'
import { PrimaryButton } from 'components/PrimaryButton'
import { useSession } from 'contexts'
import { Link } from 'react-router-dom'
import { Template } from './Template'
import { Button, TextField, Checkbox } from '@material-ui/core'
import zxcvbn from 'zxcvbn'
import { isStrongPassword, getPasswordStrengthColor } from 'utils'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

interface IError {
    [field: string]: string
}

export const ResetPassword = () => {
    const history = useHistory()
    const { forgotCode } = useParams<{ forgotCode: string }>()
    const { requestResetPassword, requestVerifyForgotCode } = useSession()
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<IError>({})
    const [loading, setLoading] = useState(false)
    const [passStrength, setPassStrength] = useState(0)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await requestVerifyForgotCode(forgotCode)
                if (res.errors) {
                    history.push('/')
                    toast.error(`Invalid verification code`)
                } else {
                    setEmail(res.user.email)
                    setToken(res.user.token)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetch()
    }, [forgotCode])

    const handleValidation = (field: string, value: Maybe<string>) => {
        const error: IError = {}
        error[field] = value ? '' : 'This field is required'
        if (field === 'confirmPassword') {
            if (newPassword !== confirmPassword) {
                error[field] = "Make sure both passwords match!"
            }
        }
        return error
    }

    const handleInputChange = (e: any) => {
        const field = e.target.id
        const value = e.target.value

        if (field === 'newPassword') {
            let isStrong = isStrongPassword(value)
            let passScore = zxcvbn(value).score
            if (passScore >= 4 && !isStrong) passScore = 3
            if (isStrong) passScore = 4
            setPassStrength(passScore)
            setNewPassword(value)
        } else if (field === 'confirmPassword') {
            setConfirmPassword(value)
        }

        const error = { ...errors, ...handleValidation(field, value) }
        if (errors.invalidCredentials) {
            delete errors.invalidCredentials
        }

        // setErrors(error)
        setErrors({})
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const error = {
            ...errors,
            ...handleValidation('newPassword', newPassword),
            ...handleValidation('confirmPassword', confirmPassword),
        }
        const userCredentialsValid =
            Object.keys(error).filter((field) => error[field] !== '').length === 0
        if (!userCredentialsValid) {
            setErrors(error)
            return
        } else {
            setLoading(true)
            try {
                const res = await requestResetPassword(token, email, newPassword)
                if (res.errors) {
                    setErrors(res.errors)
                } else {
                    toast.success(`Your password has been reset successfully`)
                    history.push('/')
                }
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
    }

    return (
        <Template>
            <div className='w-full h-full flex flex-col items-center'>
                <div className='w-full md:w-[440px]'>
                    <form className='flex flex-col justify-center items-center gap-6 md:gap-8' onSubmit={handleSubmit}>
                        <TextField
                            id="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={handleInputChange}
                            error={!!errors.email || !!errors.invalidCredentials}
                            helperText={errors.email || errors.invalidCredentials}
                            className='w-full px-4 py-4'
                            disabled={true}
                        />
                        <div className='w-full'>
                            <TextField
                                id="newPassword"
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={handleInputChange}
                                error={!!errors.newPassword}
                                helperText={errors.password}
                                className='w-full px-4 py-4'
                                disabled={loading}
                            />
                            {newPassword.length > 0 && <div className='w-full flex gap-2 mt-2'>
                                <div className='basis-1/3 h-1' style={{ backgroundColor: getPasswordStrengthColor(passStrength) }}></div>
                                <div className='basis-1/3 h-1' style={{ backgroundColor: passStrength > 1 ? getPasswordStrengthColor(passStrength) : '#bbbbbb' }}></div>
                                <div className='basis-1/3 h-1' style={{ backgroundColor: passStrength > 3 ? getPasswordStrengthColor(passStrength) : '#bbbbbb' }}></div>
                            </div>}
                        </div>
                        <TextField
                            id="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            className='w-full px-4 py-4'
                            disabled={loading}
                        />
                        <div className='mt-8 w-full flex justify-center'>
                            <PrimaryButton onClick={handleSubmit} width='227px' disabled={loading || passStrength <= 3 || !email}>
                                Reset Password
                            </PrimaryButton>
                            <div className='hidden'><Button type="submit" disabled={loading} /></div>
                        </div>
                        <Link to="/">
                            <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
                        </Link>
                    </form>
                </div>
            </div>
        </Template>
    )
}
