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
import { useTokenPrice } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'
import { PrimaryButtonMD } from 'components/PrimaryButtonMD'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { TokenPriceHistory } from './History'
import { getShortDateTime } from 'utils'
import { useProcessing } from 'contexts'

interface IPriceInfo {
    index: number
    info: any
    handleHistory: () => void
    updatePriceList: () => void
}

const PriceInfo: React.FC<IPriceInfo> = ({
    index,
    info,
    handleHistory,
    updatePriceList
}) => {
    const { requestUpdatePrice } = useTokenPrice()
    const [isEdit, setIsEdit] = useState(false)
    const [value, setValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { setProcessing } = useProcessing()

    const onEdit = () => {
        setIsEdit(true)
        setValue(info.price)
    }

    useEffect(() => {
        setProcessing(isSaving)
    }, [isSaving])

    const onSave = async () => {
        setIsSaving(true)
        try {
            const res1 = await requestUpdatePrice(info._id, Number(value), info.price)
            if (!res1.errors) {
                await updatePriceList()
                toast.success(`Price for ${info.tokenName} saved successfully`)
            } else {
                toast.error(res1.errors.message)
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
                <TableCell style={{ textAlign: 'center' }}>{info.tokenName}</TableCell>
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
                        <>{info.price}</>
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

export const Price_Edit = () => {
    const { requestPriceList } = useTokenPrice()
    const [editPriceId, setEditPriceId] = useState('')
    const [showHistory, setShowHistory] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [priceList, setPriceList] = useState<any[]>([])

    const updatePriceList = async () => {
        try {
            const res = await requestPriceList()
            setPriceList(res.pricelist)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        updatePriceList()
    }, [])

    const handleHistory = (id: string) => {
        setEditPriceId(id)
        setShowHistory(true)
    }

    return (
        <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
            <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
                {showHistory ? (
                    <TokenPriceHistory
                        id={editPriceId || ''}
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
                                        <b>Token</b>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <b>Price ($)</b>
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
                                    {priceList && priceList
                                        .map((info, index) => (
                                            <PriceInfo
                                                index={index}
                                                info={info}
                                                key={index}
                                                handleHistory={() => handleHistory(info._id)}
                                                updatePriceList={updatePriceList}
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
