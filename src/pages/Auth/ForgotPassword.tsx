import React, { useState } from 'react'
import { Button, TextField, Checkbox } from '@material-ui/core'
import { useSession } from 'contexts'
import { useHistory } from 'react-router-dom'
import { PrimaryButton } from 'components/PrimaryButton'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

interface IError {
    [field: string]: string
}

export const ForgotPassword = () => {
    const { requestForgotCode } = useSession()
    const history = useHistory()

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<IError>({})
    const [loading, setLoading] = useState(false)

    const handleValidation = (field: string, value: Maybe<string>) => {
        const error: IError = {}
        error[field] = value ? '' : 'This field is required'
        return error
    }

    const handleInputChange = (e: any) => {
        const field = e.target.id
        const value = e.target.value

        if (field === 'email') {
            setEmail(value)
        }
        setErrors({})
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const error = {
            ...errors,
            ...handleValidation('email', email)
        }
        const userCredentialsValid =
            Object.keys(error).filter((field) => error[field] !== '').length === 0
        if (!userCredentialsValid) {
            setErrors(error)
            return
        } else {
            setLoading(true)
            try {
                const res = await requestForgotCode(email)
                console.log(res)
                if (res.errors) {
                    setErrors(res.errors)
                } else {
                    toast.success(`An email has been sent to reset your password`)
                }
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
    }

    return (
        <form className='flex flex-col justify-center items-center gap-6 md:gap-8 mt-8 md:mt-16' onSubmit={handleSubmit}>
            <div className='text-[24px] text-black my-8'>Forgot Password</div>
            <TextField
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={handleInputChange}
                error={!!errors.email || !!errors.invalidCredentials}
                helperText={errors.email || errors.invalidCredentials}
                className='w-full px-4 py-4'
                disabled={loading}
            />
            <div className='mt-10'>
                <PrimaryButton onClick={handleSubmit} width='227px' disabled={loading || !email}>
                    Forgot Password
                </PrimaryButton>
                <div className='hidden'><Button type="submit" disabled={loading} /></div>
            </div>            
            <Link to="/">
                <span className='text-[18px] text-[##474747] horver:underline'>Return home</span>
            </Link>
        </form>
    )
}
