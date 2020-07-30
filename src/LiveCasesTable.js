import React from "react"
import numeral from "numeral"
import "./Table.css"

function LiveCasesTable({ countries }) {
  console.log(countries, "countries")

  return (
    <div className="table">
      {countries.map(({ country, cases }, index) => (
        <tr key={index}>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  )
}

export default LiveCasesTable
