import React, { useState, useEffect } from "react"
import { FormControl, MenuItem, Select, Card, CardContent } from "@material-ui/core"

import InfoBox from "./InfoBox"
import Map from "./Map"
import "./App.css"
import Footer from "./Footer"
import image from './image.png';

import { sortData, prettyPrintState } from "./util"

import LiveCasesTable from "./LiveCasesTable"
import LineGraph from "./LineGraph"

import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})

  const [tableData, setTableData] = useState([])

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)

  const [mapCountries, setMapCountries] = useState([])

  const [casesType, setCasesType] = useState("cases")
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((respone) => respone.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])
  useEffect(() => {
    // the code inside here will run once when the component loads and not again bcz we add empty array on it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United State,India
            value: country.countryInfo.iso2, // USA,IND
          }))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])
  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode)

        //All of the data...
        //from the country response

        setCountryInfo({ ...data })
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }
  return (
      <>
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        <img className="cimage" src={image} alt="COVID-19" />
          <h1>COVID-19 TRACKER </h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={() => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintState(countryInfo.todayCases)}
            total={prettyPrintState(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={() => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintState(countryInfo.todayRecovered)}
            total={prettyPrintState(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={() => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintState(countryInfo.todayDeaths)}
            total={prettyPrintState(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType} // when  we click on infoBox then state change so on then we can change our map data and chart data
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by country</h3>
          <LiveCasesTable countries={tableData} />
          {/* Graph  */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
          {/* same like map its also change line graph data on click of infoBox */}
        </CardContent>
      </Card><br/><br/>
      
    </div>
    <div style={{textAlign: " center" }}>
    <Footer/>
    </div>
    <br/>
    </>
  )
}

export default App
