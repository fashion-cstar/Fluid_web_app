import React, { useState } from 'react'
import { Button, makeStyles, TextField } from '@material-ui/core'
import { useSession } from 'contexts'
import { useHistory } from 'react-router-dom'
import { PrimaryButton } from 'components/PrimaryButton'
import zxcvbn from 'zxcvbn'
import { isStrongPassword, getPasswordStrengthColor } from 'utils'

interface IError {
  [field: string]: string
}

export const Signup = ({ setIsSignUp, handleSendSignUp }: { setIsSignUp: (isSignUp: boolean) => void, handleSendSignUp: (email: string) => void }) => {
  const { requestUserSignup } = useSession()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<IError>({})
  const [loading, setLoading] = useState(false)
  const [passStrength, setPassStrength] = useState(0)

  const handleValidation = (field: string, value: Maybe<string>) => {
    const error: IError = {}
    error[field] = value ? '' : 'This field is required'
    if (field === 'confirmPassword') {
      if (password !== confirmPassword) {
        error[field] = "Make sure both passwords match!"
      }
    }
    return error
  }

  const handleInputChange = (e: any) => {
    const field = e.target.id
    const value = e.target.value

    if (field === 'email') {
      setEmail(value)
    } else if (field === 'password') {
      let isStrong = isStrongPassword(value)
      let passScore = zxcvbn(value).score
      if (passScore>=4 && !isStrong) passScore=3
      if (isStrong) passScore = 4
      setPassStrength(passScore)
      setPassword(value)
    } else if (field === 'name') {
      setName(value)
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
      ...handleValidation('name', name),
      ...handleValidation('email', email),
      ...handleValidation('password', password),
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
        const res = await requestUserSignup(email, password, name)
        if (res.errors) {
          setErrors(res.errors)
        } else {
          // history.push('/signin')
          handleSendSignUp(email)
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
  }

  return (
    <form className='flex flex-col justify-center items-center gap-6 md:gap-8 mt-8 md:mt-16' onSubmit={handleSubmit}>
      <TextField
        id="name"
        value={name}
        label="Full Name"
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name}
        className='w-full px-4 py-4'
        disabled={loading}
      />
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
      <div className='w-full'>
        <TextField
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={handleInputChange}
          error={!!errors.password}
          helperText={errors.password}
          className='w-full px-4 py-4'
          disabled={loading}
        />
        {password.length > 0 && <div className='w-full flex gap-2 mt-2'>
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
      <div className='mt-10'>
        <PrimaryButton onClick={handleSubmit} width='227px' disabled={loading || passStrength<=3}>
          Sign Up
        </PrimaryButton>
        <div className='hidden'><Button type="submit" disabled={loading} /></div>
      </div>
      <div className='flex text-[18px] gap-2 mt-2 md:mt-4'>
        <span className="text-[#474747]">Already have an account?</span>
        <div className="text-[#3FBCE9] cursor-pointer" onClick={() => setIsSignUp(false)}>Login</div>
      </div>
    </form>
  )
}
