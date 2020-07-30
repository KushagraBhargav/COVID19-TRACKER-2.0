import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import numeral from "numeral"

function LineGraph({casesType,...props}) {
  const [data, setData] = useState([])
  const options = {
    legend: {
      display: false,
    },
    elemets: {
      point: {
          radius:0,
      },
        
    },
    maintainAspectRation:false,

    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function (tooltipItem,data){
                return numeral(tooltipItem.value).format("0a");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    // Include $ sign in the ticks
                    callback:function (value,index,values){
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
  }

  useEffect(() => {
    const fetchData=async()=>{
   await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const chartData = buildChartData(data, casesType)
        console.log("chartdata", chartData)
        setData(chartData)
      })
    }
    fetchData();
  }, [casesType])

  const buildChartData = (data, casesType) => {
    let chartData = []
    let lastDataPoint
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][date]
    }
    return chartData
  }
  return (
    <div className={props.className}>
      {data.length>0 && (
      <Line
        options={options}
        data={{
            datasets: [
            {
              backgroundColor: 'rgba(204,16,52,0.5)',
              borderColor: '#CC1034',
              data: data,
            },
          ],
        }}
      />)}
    </div>
  )
}

export default LineGraph
