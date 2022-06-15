/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
    Button,
    makeStyles,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core'
import PaperComponent from 'components/DraggableModalPaper'
import zxcvbn from 'zxcvbn'
import { useSession } from 'contexts'
import { PrimaryButton } from 'components/PrimaryButton'
import { toast } from 'react-toastify'
import { isStrongPassword, getPasswordStrengthColor } from 'utils'

const useStyles = makeStyles(() => ({
    root: {
        width: 500,
        margin: '1rem',
        padding: '1rem',
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: 8,
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    row: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0.5rem',
    },
    input: {
        width: '100%',
    },
}))

interface IChangePasswordType {
    isOpen: boolean
    handleClose: () => void
}

interface IError {
    [field: string]: string
}

export const ChangePassword: React.FC<IChangePasswordType> = ({ isOpen, handleClose }) => {
    const classes = useStyles()
    const { requestUserChangePassword } = useSession()
    const [newPassword, setNewPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<IError>({})
    const [loading, setLoading] = useState(false)
    const [passStrength, setPassStrength] = useState(0)

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

        if (field === 'currentPassword') {
            setCurrentPassword(value)
        } else if (field === 'newPassword') {
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
            ...handleValidation('currentPassword', currentPassword),
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
                const res = await requestUserChangePassword(currentPassword, newPassword)
                if (res.errors) {
                    setErrors(res.errors)
                } else {
                    // history.push('/signin')
                    toast.success(`Your password has been changed successfully`)
                    handleClose()
                }
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
    }

    return (
        <div>
            <Dialog
                onClose={() => loading ? () => { } : handleClose()}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
                PaperComponent={PaperComponent}
            >
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    <Typography variant="h5">
                        Change Password
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col gap-6 p-4 justify-center' style={{ width: '320px' }}>
                        <TextField
                            id="currentPassword"
                            type="password"
                            label="Current Password"
                            value={currentPassword}
                            onChange={handleInputChange}
                            error={!!errors.currentPassword}
                            helperText={errors.password}
                            className='w-full px-4 py-4'
                            disabled={loading}
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
                            <PrimaryButton onClick={handleSubmit} width='227px' disabled={loading || currentPassword.length<=0 || passStrength<=3}>
                                Change Password
                            </PrimaryButton>
                            <div className='hidden'><Button type="submit" disabled={loading} /></div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
