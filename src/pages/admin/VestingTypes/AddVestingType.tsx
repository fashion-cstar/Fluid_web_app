/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import PaperComponent from 'components/DraggableModalPaper'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { useVesting, useProcessing } from 'contexts'
import { useHistory, useParams } from 'react-router-dom'
import { VF_LIST } from 'types'
import { formatEther, parseEther } from 'utils'
import { useVestingLog } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'
import { BigNumber } from 'ethers'

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

interface IAddVestingType {
  isOpen: boolean
  handleClose: () => void
  edit?: boolean
  id: number
}

interface IParam {
  id?: string
}

const VF_DEFAULT = 1

const getLocal2UTC_timestamp = (timevalue: number): number => {
  let timezoneOffset = (new Date()).getTimezoneOffset() //mins
  // timezoneOffset = timezoneOffset * 60 //seconds
  timezoneOffset = 0
  return (timevalue - timezoneOffset)
}

const getUTC2Local_timestamp = (timevalue: number): number => {
  let timezoneOffset = (new Date()).getTimezoneOffset() //mins
  // timezoneOffset = timezoneOffset * 60 //seconds
  timezoneOffset = 0
  return (timevalue + timezoneOffset)
}

export const AddVestingType: React.FC<IAddVestingType> = ({ isOpen, handleClose, edit, id }) => {
  const classes = useStyles()
  const history = useHistory()
  const { addVestingType, updateVestingType, vestingTypes } = useVesting()
  const { requestSaveTypeLog } = useVestingLog()
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [lockupDuration, setLockupDuration] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [vestingFrequency, setVestingFrequency] = useState(VF_DEFAULT)
  const { setProcessing } = useProcessing()
  const [soldAmount, setSoldAmount] = useState(BigNumber.from(0))
  useEffect(() => {
    setProcessing(loading)
  }, [loading])

  useEffect(() => {
    if (edit && vestingTypes.length > Number(id)) {
      const info = vestingTypes[Number(id)]
      setName(info.name)

      setStartTime(new Date(getUTC2Local_timestamp(info.startTime) * 1000))
      setEndTime(new Date(getUTC2Local_timestamp(info.endTime) * 1000))
      setLockupDuration(
        Math.abs(info.lockupDuration / 60 / 60 / 24).toString()
      )
      setMaxAmount(formatEther(info.maxAmount, undefined, 3, false))
      setVestingFrequency(VF_LIST[info.vestingFrequencyId].value)
      setSoldAmount(info.vestedAmount)
    }
  }, [vestingTypes, edit, id, isOpen])

  useEffect(() => {
    if (isOpen && !edit) {
      setStartTime(new Date())
      setEndTime(new Date())
    }
    if (!isOpen) {
      setName('')
      setLockupDuration('')
      setMaxAmount('')
      setLoading(false)
      setVestingFrequency(VF_DEFAULT)
      setSoldAmount(BigNumber.from(0))
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setLoading(true)
    let res = false
    let timezoneOffset = startTime.getTimezoneOffset() //mins
    timezoneOffset = timezoneOffset * 60 //seconds
    let action = edit ? 1 : 0
    let typeId = edit ? Number(id) : vestingTypes.length
    if (edit) {
      if (Number(id) >= 0) {
        res = await updateVestingType(
          Number(id),
          name,
          getLocal2UTC_timestamp(Math.floor(startTime.getTime() / 1000)),
          getLocal2UTC_timestamp(Math.floor(endTime.getTime() / 1000)),
          Math.floor(Number(lockupDuration)) * 24 * 60 * 60,
          Number(maxAmount),
          vestingFrequency
        )
      }
    } else {
      res = await addVestingType(
        name,
        getLocal2UTC_timestamp(Math.floor(startTime.getTime() / 1000)),
        getLocal2UTC_timestamp(Math.floor(endTime.getTime() / 1000)),
        Math.floor(Number(lockupDuration)) * 24 * 60 * 60,
        Number(maxAmount),
        vestingFrequency
      )
    }
    if (res) {
      try {
        const res1 = await requestSaveTypeLog(action,
          typeId,
          name,
          startTime,
          endTime,
          Math.floor(Number(lockupDuration)) * 24 * 60 * 60,
          vestingFrequency,
          Number(maxAmount))
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
            {edit ? 'Edit' : 'Add'} vesting type
          </Typography>
        </DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box className={clsx(classes.root, classes.flex)}>
              <Box className={classes.row}>
                <TextField
                  variant="outlined"
                  label="Type Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className={classes.input}
                />
              </Box>

              <Box className={classes.row}>
                <DateTimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(_date) => setStartTime(_date as Date)}
                  className={classes.input}
                  disabled={loading}
                  format="yyyy-MM-dd hh:mm a"
                />
              </Box>

              <Box className={classes.row}>
                <DateTimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(_date) => setEndTime(_date as Date)}
                  className={classes.input}
                  disabled={loading}
                  format="yyyy-MM-dd hh:mm a"
                />
              </Box>

              <Box className={classes.row}>
                <TextField
                  variant="outlined"
                  type="number"
                  label="Lockup Duration (days)"
                  value={lockupDuration}
                  onChange={(e) => setLockupDuration(e.target.value)}
                  disabled={loading}
                  className={classes.input}
                />
              </Box>

              <Box className={classes.row}>
                <FormControl style={{ width: '100%' }} disabled={loading}>
                  <InputLabel id="vesting-type-label">Vesting Frequency</InputLabel>
                  <Select
                    labelId="vesting-type-label"
                    value={vestingFrequency}
                    label="Vesting Type"
                    onChange={(e) => setVestingFrequency(Number(e.target.value))}
                  >
                    {VF_LIST.filter(item => item.value !== 0).map((info, index) => (
                      <MenuItem value={info.value} key={info.value}>
                        {info.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box className={classes.row}>
                <TextField
                  variant="outlined"
                  type="number"
                  label="Total Amount"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
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
                  disabled={loading || !(Number(maxAmount) > 0) || !parseEther(Number(maxAmount).toString(), undefined).gte(soldAmount)}
                  className={classes.input}
                  onClick={handleSubmit}
                  style={{color:loading?'#f97316':''}}
                >
                  {loading ? 'Confirming' : 'Confirm'}
                </Button>
              </Box>
            </Box>
          </MuiPickersUtilsProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}
