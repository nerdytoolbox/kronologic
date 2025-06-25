import { LOCATIONS, MAP } from "./constants/locations.js";
import { PEOPLE } from "./constants/people.js";
import { TIMESTAMPS } from "./constants/timestamps.js";
import { LocationPersonRecord, LocationTimestampRecord, useKronologicSolver } from "./util/useKronologicSolver.jsx";
import { useEffect, useState } from "react";
import { Button } from "nerdy-lib";
import { starterInformation, locationPersonInformation, locationTimestampInformation } from "./solutions/I_1.js";

function App() {
  const { addRecord, state, solutions, numberOfSolutionsExceeded } = useKronologicSolver(LOCATIONS, MAP, PEOPLE, TIMESTAMPS)

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [informationHistory, setInformationHistory] = useState([])

  useEffect(() => {
    starterInformation.forEach(record => {
      addRecord(record)
    })
  }, [])

  // console.log(solutions)
  // console.log(numberOfSolutionsExceeded)

  const solution = solutions.length > 0 ? solutions[0] : null

  const handleButtonClick = (type, selection) => {
    if (type === 'location') {
      setSelectedLocation(selection)
    } else if (type === 'person') {
      setSelectedTime(null)
      setSelectedPerson(selection)
    } else if (type === 'time') {
      setSelectedPerson(null)
      setSelectedTime(selection)
    }
  }

  const handleAddInformation = () => {
    if (!selectedLocation) {
      alert("Choose a location to add information.")
    }

    const locationIndex = LOCATIONS.findIndex(l => l === selectedLocation)
    if (selectedPerson) {
      const personIndex = PEOPLE.findIndex(p => p === selectedPerson)
      const record = locationPersonInformation[locationIndex][personIndex]
      setInformationHistory(prevState => [...prevState, record])
      addRecord(record)
    } else if (selectedTime) {
      const timeIndex = TIMESTAMPS.findIndex(t => t === selectedTime)
      const record = locationTimestampInformation[locationIndex][timeIndex]
      setInformationHistory(prevState => [...prevState, record])
      addRecord(record)
    } else {
      alert("Choose a person or time to add information.")
    }
  }

  return (
    <div className="align-vertical">
      <div className="align-horizontal">
        <div className="align-vertical align-center">
          <div className="align-horizontal block">
            <div className="align-center align-vertical">
              <h3>Pick a location</h3>
              {LOCATIONS.map(l => {
                return (
                  <Button key={l} onClick={() => handleButtonClick("location", l)} selected={selectedLocation === l}>{l}</Button>
                )
              })}
            </div>
            <div className="align-center align-vertical">
              <h3>Pick a person or time</h3>
              <div className="align-horizontal">
                <div className="align-center align-vertical">
                  {PEOPLE.map(p => {
                    return (
                      <Button key={p} onClick={() => handleButtonClick("person", p)} selected={selectedPerson === p}>{p}</Button>
                    )
                  })}
                </div>
                <div className="align-center align-vertical">
                  {TIMESTAMPS.map(t => {
                    return (
                      <Button key={t} onClick={() => handleButtonClick("time", t)} selected={selectedTime === t}>Time {t}</Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleAddInformation}>Add this information</Button>
        </div>
        <div className="align-vertical" style={{ marginLeft: "2rem", flexWrap: "wrap" }}>
          <h3>Information history</h3>
          {informationHistory.map((entry, index) => {
            if (entry instanceof LocationPersonRecord) {
              return <span key={index}>{`${entry.location} - ${entry.person}: ${entry.total} / ${entry.timestamp}`}</span>
            } else if (entry instanceof LocationTimestampRecord) {
              return <span key={index}>{`${entry.location} - Time ${entry.timestamp}: ${entry.total} / ${entry.person}`}</span>
            }
            return <span key={index}>Cannot find information</span>
          })}
        </div>
      </div>
      <div className="align-center">
        {numberOfSolutionsExceeded && <div>There is not yet enough data to deduct the solution.</div>}
        {!numberOfSolutionsExceeded && solutions.length > 1 && <div>There is no unique solution, this is the first one found</div>}
        <table>
          <tbody>
          <tr>
            <td></td>
            <td>{TIMESTAMPS[0]}</td>
            <td>{TIMESTAMPS[1]}</td>
            <td>{TIMESTAMPS[2]}</td>
            <td>{TIMESTAMPS[3]}</td>
            <td>{TIMESTAMPS[4]}</td>
            <td>{TIMESTAMPS[5]}</td>
          </tr>
          {PEOPLE.map((p, indexP) => {
            const rowData = []
            TIMESTAMPS.map((t, indexT) => {
              let loc
              if (!numberOfSolutionsExceeded && solution !== null) {
                loc = solution[indexP][indexT]
              } else if (state.length > 0 && state[indexP][indexT] !== -1) {
                loc = state[indexP][indexT]
              }
              const known = state.length > 0 ? state[indexP][indexT] !== -1 : null
              rowData.push({ loc, known })
            })

            return (
              <tr key={indexP}>
                <td>{p}</td>
                {rowData.map((r, indexR) => {
                  return <td key={indexR}  style={{ height: "3rem", width: "9rem", border: "1px solid gray", padding: "0.5rem", color: r.known ? "red" : "white" }}>{LOCATIONS[r.loc]}</td>
                })}
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
