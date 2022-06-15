/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useApy } from 'contexts'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { getShortDateTime } from 'utils'

interface IHistoryItem {
  info: any
}

const HistoryItem: React.FC<IHistoryItem> = ({ info }) => {

  return (
    <TableRow>
      <TableCell style={{ textAlign: 'center' }}>{info.apy?.pool}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{info.apyAfter}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(info.updatedAt))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{info.updatedBy?.name}</TableCell>
    </TableRow>
  )
}

interface IApyHistory {
  id: string
  onBack: () => void
}

export const ApyHistory: React.FC<IApyHistory> = ({
  id,
  onBack,
}) => {
  const [apyLogs, setApyLogs] = useState<any[]>([])
  const { requestUpdateLogs } = useApy()
  useEffect(() => {

    const fetch = async () => {
      try {
        const res = await requestUpdateLogs(id)        
        setApyLogs(res.logs)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>APR History</h3>

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
              <b>Pool</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>APR</b>
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
          {apyLogs.map((item, index) => (
            <HistoryItem info={item} key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
