/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { VestingTable } from './VestingTable'

export const Vesting = () => {

  return (
    <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
      <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>
        <Switch>
          <Route path="/admin/vesting" component={VestingTable} />
          <Redirect to="/admin/vesting" />
        </Switch>
      </div>
    </div>
  )
}
