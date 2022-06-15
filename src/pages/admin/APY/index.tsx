/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { useApy, useSession, useStaking } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'
import { PrimaryButtonMD } from 'components/PrimaryButtonMD'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { ApyHistory } from './History'
import { getShortDateTime } from 'utils'
import { useProcessing } from 'contexts'

interface IApyInfo {
    index: number
    info: any
    handleHistory: () => void
    updateApyList: () => void
}

const ApyInfo: React.FC<IApyInfo> = ({
    index,
    info,
    handleHistory,
    updateApyList
}) => {
    const { requestUpdateApy } = useApy()
    const { setAPY } = useStaking()
    const [isEdit, setIsEdit] = useState(false)
    const [value, setValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { setProcessing } = useProcessing()

    const onEdit = () => {
        setIsEdit(true)
        setValue(info.apy)
    }

    useEffect(() => {
        setProcessing(isSaving)
    }, [isSaving])

    const onSave = async () => {
        setIsSaving(true)
        try {
            const res = await setAPY(info.poolId, Number(value))
            if (res) {
                const res1 = await requestUpdateApy(info._id, Number(value), info.apy)
                if (!res1.errors) {
                    await updateApyList()
                    toast.success(`APR for ${info.pool} saved successfully`)
                } else {
                    toast.error(res1.errors.message)
                }
            }
            setIsEdit(false)
            setIsSaving(false)
        } catch (err) {
            setIsSaving(false)
            toast.error(`Saving APR for ${info.pool} failed`)
            console.log(err)
        }
    }

    return (
        <>
            <TableRow key={info._id}>
                <TableCell style={{ textAlign: 'right' }}>{(index + 1)}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{info.pool}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                    {isEdit ?
                        <>
                            <TextField
                                variant="outlined"
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value !== '' ? Number(e.target.value) > 0 ? Number(e.target.value).toString() : e.target.value : '')}
                                disabled={isSaving}
                                style={{ width: '120px' }}
                                margin="dense"
                                inputProps={{ style: { fontSize: 24, color: '#3F3F3F', textAlign: 'center' } }} // font size of input text            
                                InputLabelProps={{ style: { fontSize: 24, color: '#3F3F3F', textAlign: 'center' } }}
                                onInput={(e: any) => {
                                    // e.target.value = Math.max(0, Number(e.target.value)).toString().slice(0, 12)                            
                                    if (Number(e.target.value) < 0) e.target.value = -Number(e.target.value)
                                }}
                            />
                        </> :
                        <>{info.apy}</>
                    }
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(info.updatedAt))}</TableCell>
                <TableCell
                    className='flex items-center gap-4'
                    style={{ textAlign: 'center' }}
                >
                    {isEdit ? <>
                        <PrimaryButtonMD
                            width='100px'
                            onClick={onSave}
                            disabled={isSaving}
                            isLoading={isSaving}
                        >
                            {isSaving?'Saving...':'Save'}
                        </PrimaryButtonMD>
                        <SecondaryButtonMD
                            onClick={() => { setIsEdit(false) }}
                            disabled={isSaving}
                        >
                            Cancel
                        </SecondaryButtonMD>
                    </> :
                        <>
                            <PrimaryButtonMD
                                width='100px'
                                onClick={onEdit}
                            >
                                Edit
                            </PrimaryButtonMD>
                            <SecondaryButtonMD
                                onClick={handleHistory}
                            >
                                History
                            </SecondaryButtonMD>
                        </>}
                </TableCell>
            </TableRow>
        </>
    )
}

export const APY_Edit = () => {
    const { requestApyList } = useApy()
    const [editApyId, setEditApyId] = useState('')
    const [showHistory, setShowHistory] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [apyList, setApyList] = useState<any[]>([])

    const updateApyList = async () => {
        try {
            const res = await requestApyList()
            setApyList(res.apylist)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        updateApyList()
    }, [])

    const handleHistory = (id: string) => {
        setEditApyId(id)
        setShowHistory(true)
    }

    return (
        <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
            <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
                {showHistory ? (
                    <ApyHistory
                        id={editApyId || ''}
                        onBack={() => setShowHistory(false)}
                    />
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <b>No</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <b>Pool</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <b>APR (%)</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <b>UpdatedAt</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <b>Actions</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {!isLoading &&
                                <TableBody>
                                    {apyList && apyList
                                        .map((info, index) => (
                                            <ApyInfo
                                                index={index}
                                                info={info}
                                                key={index}
                                                handleHistory={() => handleHistory(info._id)}
                                                updateApyList={updateApyList}
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
                    </>
                )}
            </div>
        </div>
    )
}
