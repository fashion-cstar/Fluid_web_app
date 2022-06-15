/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    FormControlLabel
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { useSession, useProcessing } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getShortDateTime } from 'utils'

const useStyles = makeStyles(() => ({
    checkbox: {
        marginLeft: "30px"
    }
}))

interface IUserInfo {
    index: number
    info: any
}

const UserInfo: React.FC<IUserInfo> = ({
    index,
    info
}) => {
    const classes = useStyles()
    const [checked, setChecked] = useState(false)
    const [sendingPermit, setSendingPermit] = useState(false)
    const { requestUpdatePermit } = useSession()
    const { setProcessing } = useProcessing()
    
    useEffect(() => {
        setChecked(info.permit === 1 ? true : false)
    }, [info])

    useEffect(() => {
        setProcessing(sendingPermit)
    }, [sendingPermit])

    const handlePermit = async (event: any) => {
        let id = info._id
        let email = info.email
        let name = info.name
        let permit = event.target.checked ? 1 : 0
        try {
            setSendingPermit(true)
            const res = await requestUpdatePermit(id, email, name, permit)
            if (!res.errors) {
                setChecked(!event.target.checked)
                toast.success(permit === 1 ? "Approved!" : "Unapproved!")
            } else {
                setChecked(event.target.checked)
                toast.error(res.errors.message)
            }
            setSendingPermit(false)
        } catch (err) {
            setChecked(event.target.checked)
            let error: any = err
            toast.error(error.message)
            setSendingPermit(false)
        }
    }


    return (
        <TableRow key={info.vestingId}>
            <TableCell style={{ textAlign: 'right' }}>{(index + 1)}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{info.name}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{info.email}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(info.createdAt))}</TableCell>
            <TableCell className='flex justify-center items-center' style={{ textAlign: 'center' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handlePermit}
                            // value={checked}
                            classes={{
                                root: classes.checkbox
                            }}
                            color="primary"
                            disabled={sendingPermit}
                        />
                    }
                    label=""
                />
            </TableCell>
        </TableRow>
    )
}

export const UserList = () => {
    const classes = useStyles()
    const { requestUserList } = useSession()
    const [permitId, setPermitId] = useState(-1)
    const [userList, setUserList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true)
            try {
                const res = await requestUserList()
                if (!res.errors) {
                    setUserList(res.userlist)
                } else {
                    setUserList([])
                }
                setIsLoading(false)
            } catch (err) {
                setIsLoading(false)
                console.log(err)
            }
        }
        fetch()
    }, [])

    return (
        <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
            <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
                <div className='w-full flex justify-start'>
                    <FormControl style={{ width: 200 }}>
                        <InputLabel id="vesting-type-label">Approval Status</InputLabel>
                        <Select
                            labelId="vesting-type-label"
                            value={permitId}
                            label="Vesting Type"
                            onChange={(e) => setPermitId(Number(e.target.value))}
                        >
                            <MenuItem value={-1}>All</MenuItem>
                            <MenuItem value={0}>Not Approved</MenuItem>
                            <MenuItem value={1}>Approved</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: 'right' }}>
                                <b>No</b>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <b>Name</b>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <b>Email</b>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <b>CreatedAt</b>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <b>Approval</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {!isLoading &&
                        <TableBody>
                            {userList && userList
                                .filter(
                                    (item: any) =>
                                        permitId === -1 || item.permit === permitId
                                )
                                .map((info, index) => (
                                    <UserInfo
                                        index={index}
                                        info={info}
                                        key={index}
                                    />
                                ))}
                        </TableBody>
                    }
                </Table>
                {isLoading &&
                    <div className='m-5 w-full flex justify-center items-center'>
                        <CircularProgress />
                    </div>
                }
            </div>
        </div>
    )
}
