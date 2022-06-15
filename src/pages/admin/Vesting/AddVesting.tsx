/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import PaperComponent from 'components/DraggableModalPaper'
import { useVesting, useProcessing } from 'contexts'
import { VestingInfo } from 'types'
import { formatEther, parseEther } from 'utils'
import { useVestingLog } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'

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

interface IAddVesting {
  isOpen: boolean
  handleClose: () => void
  edit: boolean
  info: Maybe<VestingInfo>
}

export const AddVesting: React.FC<IAddVesting> = ({ isOpen, handleClose, edit, info }) => {
  const classes = useStyles()
  const { addVesting, updateVesting, vestingTypes } = useVesting()
  const { requestSaveAmountLog } = useVestingLog()
  const [typeId, setTypeId] = useState(0)
  const [recipient, setRecipient] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { setProcessing } = useProcessing()

  useEffect(() => {
    setProcessing(loading)
  }, [loading])

  useEffect(() => {
    if (edit && info) {
      setRecipient(info.recipient)
      setValue(formatEther(info.amount, undefined, 3, false))
    }
  }, [edit, info, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setTypeId(0)
      setRecipient('')
      setValue('')
      setLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setLoading(true)
    let res = false
    let action = edit ? 1 : 0
    let id = edit ? info ? info.typeId : 0 : typeId
    if (edit) {
      if (info) {
        res = await updateVesting(info.vestingId, recipient, Number(value))
      }
    } else {
      res = await addVesting(typeId, recipient, Number(value))
    }

    if (res) {
      try {
        const res1 = await requestSaveAmountLog(
          action,
          id,
          vestingTypes.length > id ? vestingTypes[id].name : '',
          recipient,
          Number(value))
        if (!res1.errors) {
        } else {
        }
      } catch (err) {
        console.log(err)
      }
    }
    setLoading(false)

    if (res) {
      handleClose()
    }
  }

  const validAmount = () => {
    if (vestingTypes.length > 0 && !isNaN(Number(value))) {
      return (
        parseEther(Number(value).toString()).lte(vestingTypes[typeId].maxAmount.sub(vestingTypes[typeId].vestedAmount)) && Number(value)>0
      )
    }
    return false
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
          <Typography variant="h5">{edit ? 'Edit' : 'Add'} User Vesting</Typography>
        </DialogTitle>
        <DialogContent>
          <Box className={clsx(classes.root, classes.flex)}>
            <Typography variant="h5">{edit ? 'Edit' : 'Add'} User Vesting</Typography>
            <br />

            {edit && info ? (
              <Box className={classes.row}>
                <Typography>
                  Type:{' '}
                  <b>
                    {vestingTypes.length > info.typeId ? vestingTypes[info.typeId].name : ''}
                  </b>
                </Typography>
              </Box>
            ) : (
              <FormControl className={classes.row}>
                <InputLabel id="vesting-type-label1">Type</InputLabel>
                <Select
                  labelId="vesting-type-label1"
                  value={typeId}
                  label="Vesting Type"
                  style={{ width: '100%' }}
                  onChange={(e) => setTypeId(Number(e.target.value))}
                >
                  {vestingTypes.map((type) => (
                    <MenuItem value={type.typeId} key={type.typeId}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box className={classes.row}>
              <TextField
                variant="outlined"
                label="User Wallet"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
            </Box>

            <Box className={classes.row}>
              <TextField
                variant="outlined"
                type="number"
                label="Amount"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
            </Box>
            {loading &&
              <div className='w-full flex justify-center'>
                <CircularProgress />
              </div>
            }
            <Box className={classes.row}>
              <Button
                color="primary"
                variant="contained"
                disabled={loading || !validAmount()}
                className={classes.input}
                onClick={handleSubmit}
                style={{color:loading?'#f97316':''}}
              >
                {loading ? 'Confirming' : 'Confirm'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}
