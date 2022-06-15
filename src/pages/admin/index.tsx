import React, { useEffect, useState } from 'react'
import { useVesting } from 'contexts'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { Vesting } from './Vesting'
import { VestingTypes } from './VestingTypes'
import { UserList } from './UserList'
import { Tab, Tabs } from '@material-ui/core'
import { APY_Edit } from './APY'
import { Price_Edit } from './FldPrice'

export const Admin = () => {
  const location = useLocation()
  const history = useHistory()
  const { isVestingAdmin } = useVesting()

  const [tabValue, setTabValue] = useState('0')

  if (!isVestingAdmin) {
    return <Redirect to="/" />
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    switch (location.pathname) {
      case '/admin/vesting':
        setTabValue('0')
        break
      case '/admin/vesting_type':
        setTabValue('1')
        break
      case '/admin/user':
        setTabValue('2')
        break
      case '/admin/apy':
        setTabValue('3')
        break
      case '/admin/price':
        setTabValue('4')
        break
    }
  }, [location.pathname])

  const handleTabChange = (_: any, value: string) => {
    if (value === '0') {
      history.push('/admin/vesting')
    } else if (value === '1') {
      history.push('/admin/vesting_type')
    } else if (value === '2') {
      history.push('/admin/user')
    } else if (value === '3') {
      history.push('/admin/apy')
    } else if (value === '4') {
      history.push('/admin/price')
    }
  }

  return (
    <div className='w-full flex flex-col items-center mt-6'>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab value="0" label="Wallet List" />
        <Tab value="1" label="Vesting Types" />
        <Tab value="2" label="User List" />
        <Tab value="3" label="APR" />
        <Tab value="4" label="Price" />
      </Tabs>

      <div className='w-full'>
        <Switch>
          <Route path="/admin/vesting_type" component={VestingTypes} />
          <Route path="/admin/vesting" component={Vesting} />
          <Route path="/admin/user" component={UserList} />
          <Route path="/admin/apy" component={APY_Edit} />
          <Route path="/admin/price" component={Price_Edit} />
          <Redirect to="/admin/vesting" />
        </Switch>
      </div>
    </div>
  )
}
