/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useTokenPrice } from 'contexts'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { getShortDateTime } from 'utils'

interface IHistoryItem {
  info: any
}

const HistoryItem: React.FC<IHistoryItem> = ({ info }) => {

  return (
    <TableRow>
      <TableCell style={{ textAlign: 'center' }}>{info.price?.tokenName}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{info.priceAfter}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{getShortDateTime(new Date(info.updatedAt))}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{info.updatedBy?.name}</TableCell>
    </TableRow>
  )
}

interface ITokenPriceHistory {
  id: string
  onBack: () => void
}

export const TokenPriceHistory: React.FC<ITokenPriceHistory> = ({
  id,
  onBack,
}) => {
  const [priceLogs, setPriceLogs] = useState<any[]>([])
  const { requestUpdateLogs } = useTokenPrice()
  useEffect(() => {

    const fetch = async () => {
      try {
        const res = await requestUpdateLogs(id)
        setPriceLogs(res.logs)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>Price History</h3>

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
              <b>Token</b>
            </TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <b>Price</b>
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
          {priceLogs.map((item, index) => (
            <HistoryItem info={item} key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
