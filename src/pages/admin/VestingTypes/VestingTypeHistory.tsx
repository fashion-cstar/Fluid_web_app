/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useVestingLog } from 'contexts'
import { VestingTypeEvent, VF_LIST } from 'types'
import { formatTime } from 'utils'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { getShortDateTime, getShortDateTimeWithoutSeconds } from 'utils'

interface IHistoryItem {
  event: VestingTypeEvent
}

const HistoryItem: React.FC<IHistoryItem> = ({ event }) => {
  const { eventTypeTopics } = useVestingLog()
  console.log(event)
  return (
    <TableRow>
      <TableCell style={{ textAlign: 'center' }}>{eventTypeTopics[event.action] || 'Undefined'}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.name}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTimeWithoutSeconds(new Date(event.startTime))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTimeWithoutSeconds(new Date(event.endTime))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{formatTime(event.lockupDuration)}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{VF_LIST[event.vestingFrequencyId].label}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.amount.toLocaleString()}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(event.updatedAt))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.updatedBy?.name}</TableCell>
    </TableRow>
  )
}

interface IVestingTypeHistory {
  typeId: number
  onBack: () => void
}

export const VestingTypeHistory: React.FC<IVestingTypeHistory> = ({
  typeId,
  onBack,
}) => {
  const { requestVestingTypeLogs } = useVestingLog()

  const [eventList, setEventList] = useState<VestingTypeEvent[]>([])

  useEffect(() => {
    const updateEventList = async () => {
      try {
        const res = await requestVestingTypeLogs(typeId)
        setEventList(res.logs)
      } catch (err) {
        console.log(err)
      }
    }

    updateEventList()
  }, [typeId])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>Vesting Type History</h3>

        <SecondaryButtonMD
          width='80px'
          onClick={onBack}
        >
          Back
        </SecondaryButtonMD>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Action</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Name</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Start Time</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>End Time</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Lockup Period</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Vesting Frequency</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Total</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Updated At</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Updated By</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {eventList.map((event, index) => (
            <HistoryItem event={event} key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
