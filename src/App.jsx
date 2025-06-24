import { DANCE_HALL, FOYER, GALLERY, MUSIC_HALL, STAGE, STAIRCASE, LOCATIONS, MAP } from "./constants/locations.js";
import { A, B, C, D, J, H, PEOPLE } from "./constants/people.js";
import { TIMESTAMPS } from "./constants/timestamps.js";
import { useKronologicSolver, LocationTimestampRecord, LocationPersonRecord } from "./util/useKronologicSolver.jsx";
import { useEffect } from "react";

function App() {
  const { addRecord, state, solutions, numberOfSolutionsExceeded } = useKronologicSolver(LOCATIONS, MAP, PEOPLE, TIMESTAMPS)

  useEffect(() => {
    addRecord(new LocationTimestampRecord(MUSIC_HALL, 1, null, A))
    addRecord(new LocationTimestampRecord(MUSIC_HALL, 1, null, B))
    addRecord(new LocationTimestampRecord(FOYER, 1, null, C))
    addRecord(new LocationTimestampRecord(GALLERY, 1, null, D))
    addRecord(new LocationTimestampRecord(FOYER, 1, null, J))
    addRecord(new LocationTimestampRecord(DANCE_HALL, 1, null, H))
  }, [])

  const solution = solutions.length > 0 ? solutions[0] : null

  return (
    <div>
      <div className="align-horizontal">
        <div>
          Location
        </div>
        <div>
          Person or Timestamp
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
                  return <td key={indexR}  style={{ height: "3rem", width: "9rem", border: "1px solid black", padding: "0.5rem", color: r.known ? "red" : "white" }}>{LOCATIONS[r.loc]}</td>
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
