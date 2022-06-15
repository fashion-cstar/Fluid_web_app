/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import {
  Box,
  Button,
  Card,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useVestingLog } from 'contexts'
import { VestingEvent } from 'types'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { getShortDateTime } from 'utils'

interface IHistoryItem {
  event: VestingEvent
}

const HistoryItem: React.FC<IHistoryItem> = ({ event }) => {
  const { eventVestingTopics } = useVestingLog()

  return (
    <TableRow>
      <TableCell style={{ textAlign: 'center' }}>{eventVestingTopics[event.action] || 'Undefined'}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.typeName}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.amount.toLocaleString()}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(event.updatedAt))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{event.updatedBy?.name}</TableCell>
    </TableRow>
  )
}

interface IVestingHistory {
  typeId: number
  vestingId: number
  address: string
  onBack: () => void
}

export const VestingHistory: React.FC<IVestingHistory> = ({
  typeId,
  vestingId,
  address,
  onBack,
}) => {
  const { requestVestingAmountLogs } = useVestingLog()

  const [eventList, setEventList] = useState<VestingEvent[]>([])

  useEffect(() => {
    const updateEventList = async () => {
      try {
        const res = await requestVestingAmountLogs(typeId, address)                
        setEventList(res.logs)
      } catch (err) {
        console.log(err)
      }
    }

    updateEventList()
  }, [typeId, vestingId, address])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>Wallet History</h3>

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
              <b>Vesting Type</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Amount</b>
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
