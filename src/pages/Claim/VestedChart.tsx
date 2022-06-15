/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Box, makeStyles, Button } from '@material-ui/core'
import { useVesting, useWallet } from 'contexts'
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { formatEther } from 'utils'
import { BigNumber } from 'ethers'
import moment from 'moment'
import { VestingInfo, VestingType } from 'types'
import { getShortDateTimeWithoutSeconds } from 'utils'

const seriesColor = ['#7AFBFD', '#AFF9FD', '#F3E8FF', '#7AFBFD', '#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#57534e', '#ca8a04']
const options = {
    title: {
        text: ''
    },
    series: [
        {
            name: 'Vesting',
            type: 'area',
            data: [],
            color: seriesColor[0]
        }
    ],
    tooltip: {
        enabled: true,
        formatter: function () {
            let t: any = this
            // return moment(t.x * 1000).format("MMMM Do YYYY, h:mm:ss") + '<br /><b>' + t.series.name + ': ' + t.y + '</b>'
            return getShortDateTimeWithoutSeconds(new Date(t.x * 1000)) + '<br /><b>' + t.series.name + ': ' + t.y + '</b>'
        }
    },
    plotOptions: {
        series: {
            showInLegend: false,
            turboThreshold: 0
        },
        area: {
            lineWidth: 4,
            color: '#867EE8',
            fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, 'rgba(134,126,232, 0.0)'],
                    [0.5, 'rgba(134,126,232, 0)'],
                    [1, 'rgba(134,126,232, 0)']
                ]
            },        
        }
    },
    chart: {
        backgroundColor: 'transparent',
        height: '45%',
        // width: '100%',
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        animation: {
            duration: 1000
        }
    },
    credits: {
        enabled: false
    },
    xAxis: {
        visible: true,
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        // type: 'datetime',
        labels: {
            style: {
                color: 'transparent',
                fontSize: '11px',
                fontWeight: '300',
            }
        }
    },
    yAxis: {
        tickAmount: 5,
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        gridLineColor: '#82828E',
        labels: {
            style: {
                color: '#919699',
                fontSize: '11px',
                fontWeight: '300',
            },
            formatter: function (): any {
                let t: any = this                
                return t.pos
            }
        },
        title: {
            text: ''
        }
    }
}

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        padding: '30px',
        boxSizing: 'border-box',

    }
}))

const curPointMarker = { enabled: true, fillColor: '#FFFFFF', lineWidth: 3, radius:10, symbol:'circle', lineColor: '#75BBE7' }
const pointMarker = { enabled: true, fillColor: '#FFFFFF', radius: 15, lineWidth: 2, lineColor: '#75BBE7' }
const dotLine = {
    zoneAxis: 'x',
    lineWidth: 1,
    zones: [{
        value: 8
    }, {
        dashStyle: 'Dash',
    }],
    dataLabels: {
        enabled: true,
        formatter: function (): any {
            let t: any = this
            if (t.y > 0) return t.y
            else return getShortDateTimeWithoutSeconds(new Date(t.x * 1000))
        }
    }
}


export const VestedChart = ({ info }: { info: VestingInfo }) => {
    const classes = useStyles()
    const { account } = useWallet()
    const { vestingList, vestingTypes, getVestingFrequency } = useVesting()
    const [chartOptions, setChartOptions] = useState({ ...options })

    const getYaxis = (val: BigNumber) => {
        return Number(formatEther(val, undefined, 3, false))
    }

    useEffect(() => {
        const fetch = async () => {
            if (vestingList.length > 0 && vestingTypes.length > 0 && info) {
                let chartPoints_beforeStart: any = []
                let chartPoints_afterStart: any = []
                let chartPoints_beforeEnd: any = []
                let chartPoints_afterEnd: any = []
                let chartPoints_dotLine: any = []
                let startTime = vestingTypes[info.typeId].startTime
                let endTime = vestingTypes[info.typeId].endTime
                let curTime = Math.floor(Date.parse((new Date).toString()) / 1000)
                let vfId = vestingTypes[info.typeId].vestingFrequencyId
                let userAllocation = getYaxis(info.amount)
                let vf = await getVestingFrequency(vfId)
                let isBetween = false
                let startDayVested = 0
                if (vf > 0) {
                    if (curTime < startTime) {
                        chartPoints_beforeStart.push({ x: curTime, y: 0 })
                        chartPoints_beforeStart.push({ x: startTime })
                    }
                    if (vf <= 1) {
                        if (isBetween) chartPoints_beforeEnd.push({ x: startTime, y: 0 })
                        else chartPoints_afterStart.push({ x: startTime, y: 0 })
                        if (curTime >= startTime && curTime < endTime) {
                            let cVfs = Math.floor((curTime - startTime) / vf)
                            let vested = Math.round(userAllocation * cVfs * vf / (endTime - startTime) * 1000) / 1000
                            isBetween = true
                            chartPoints_dotLine.push({ x: curTime, y: 0 })
                            chartPoints_dotLine.push({ x: curTime, y: vested,  marker: curPointMarker })
                            chartPoints_afterStart.push({ x: curTime, y: vested })
                            chartPoints_beforeEnd.push({ x: curTime, y: vested })
                        }
                    } else {
                        let preVested = 0
                        let passedNow = false
                        let preTimepoint = startTime
                        for (let i = startTime; i < endTime; i += vf) {
                            let cVfs = Math.floor((i - startTime) / vf) + 1
                            let vested = Math.round(userAllocation * cVfs * vf / (endTime - startTime) * 1000) / 1000
                            if (vested > userAllocation) vested = userAllocation
                            if (i === startTime) startDayVested = vested
                            if (curTime >= preTimepoint && curTime < i && passedNow === false) {
                                passedNow = true
                                isBetween = true
                                chartPoints_dotLine.push({ x: curTime, y: 0 })
                                chartPoints_dotLine.push({ x: curTime, y: preVested,  marker: curPointMarker })
                                chartPoints_afterStart.push({ x: curTime, y: preVested })
                                chartPoints_beforeEnd.push({ x: curTime, y: preVested })
                            }
                            if (preVested !== vested) {
                                if (isBetween) chartPoints_beforeEnd.push({ x: i, y: preVested })
                                else chartPoints_afterStart.push({ x: i, y: preVested })

                            }
                            if (isBetween) chartPoints_beforeEnd.push({ x: i, y: vested })
                            else chartPoints_afterStart.push({ x: i, y: vested })
                            preTimepoint = i
                            preVested = vested
                        }
                        if (passedNow === false && curTime >= preTimepoint && curTime < endTime) {
                            passedNow = true
                            if (isBetween) chartPoints_beforeEnd.push({ x: curTime, y: preVested })
                            else chartPoints_afterStart.push({ x: curTime, y: preVested })
                        }
                        if (preVested !== userAllocation) {
                            if (isBetween) chartPoints_beforeEnd.push({ x: endTime, y: preVested })
                            else chartPoints_afterStart.push({ x: endTime, y: preVested })
                        }
                    }
                    if (isBetween) chartPoints_beforeEnd.push({ x: endTime, y: userAllocation })
                    else chartPoints_afterStart.push({ x: endTime, y: userAllocation })
                    if (curTime >= endTime) {
                        chartPoints_afterEnd.push({ x: endTime, y: userAllocation })
                        chartPoints_afterEnd.push({ x: curTime, y: userAllocation })
                    }
                }
                let chartSeries: any = []
                let points: any = []
                points.push({ x: startTime, y: 0 })
                if (startDayVested > 0) points.push({ x: startTime, y: startDayVested })
                chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: points, color: "#555", ...dotLine })
                points = []
                points.push({ x: endTime, y: 0 })
                points.push({ x: endTime, y: userAllocation })
                chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: points, color: "#555", ...dotLine })
                
                if (chartPoints_beforeStart.length > 0) {
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_beforeStart, color: seriesColor[0] })
                }
                if (isBetween) {
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_afterStart, color: seriesColor[2] })
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_beforeEnd, color: seriesColor[1] })
                } else {
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_afterStart, color: seriesColor[1] })
                }
                if (chartPoints_afterEnd.length > 0) {
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_afterEnd, color: seriesColor[3] })
                }
                if (chartPoints_dotLine.length > 0) {
                    chartSeries.push({ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints_dotLine, color: "#555", ...dotLine })
                }
                setChartOptions({ ...options, series: chartSeries })
            }
        }
        fetch()
    }, [vestingList, vestingTypes, info])

    return (
        <div className='w-full'>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    )
}
