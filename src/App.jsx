import './App.css'
import { DANCE_HALL, FOYER, GALLERY, LOCATIONS, MAP, MUSIC_HALL, STAGE, STAIRCASE } from "./util/locations.js";
import { A, B, C, D, J, H, PEOPLE } from "./util/people.js";
import { TIMESTAMPS } from "./util/timestamps.js";
import { GameState3, LocationTimestampRecord, LocationPersonRecord } from "./gameState/GameState3.js";
import { realSolution } from "./gameState/solution.js";

function App() {

  const GameState = new GameState3(LOCATIONS, MAP, PEOPLE, TIMESTAMPS, [
    // Starting info
    new LocationTimestampRecord(MUSIC_HALL, 1, null, A),
    new LocationTimestampRecord(MUSIC_HALL, 1, null, B),
    new LocationTimestampRecord(FOYER, 1, null, C),
    new LocationTimestampRecord(GALLERY, 1, null, D),
    new LocationTimestampRecord(FOYER, 1, null, J),
    new LocationTimestampRecord(DANCE_HALL, 1, null, H),

    new LocationTimestampRecord(GALLERY, 2, 1, J),
    new LocationTimestampRecord(DANCE_HALL, 5, 2, A),
    new LocationPersonRecord(STAIRCASE, C, 2, 2),
    new LocationTimestampRecord(GALLERY, 6, 2, C),
    new LocationPersonRecord(DANCE_HALL, B, 0, null),
    new LocationTimestampRecord(GALLERY, 3, 1, B),
    new LocationTimestampRecord(GALLERY, 4, 2, H),
    new LocationTimestampRecord(GALLERY, 5, 0, null),
    new LocationTimestampRecord(STAGE, 2, 3, D),
    new LocationTimestampRecord(STAGE, 3, 1, H),
    new LocationTimestampRecord(STAGE, 4, 1, A),
    new LocationTimestampRecord(STAGE, 5, 1, J),
    new LocationTimestampRecord(STAGE, 6, 1, D),
    new LocationTimestampRecord(DANCE_HALL, 4, 0, null),
    new LocationTimestampRecord(FOYER, 4, 1, B),
    new LocationTimestampRecord(MUSIC_HALL, 4, 1, D),
    new LocationTimestampRecord(STAIRCASE, 4, 1, C),
    new LocationPersonRecord(STAGE, A, 2, 2),
    new LocationPersonRecord(MUSIC_HALL, J, 0, null),
    new LocationPersonRecord(DANCE_HALL, J, 1, 6),
    new LocationTimestampRecord(DANCE_HALL, 3, 1, D),
    new LocationTimestampRecord(STAIRCASE, 5, 2, H),
  ]);

  const locations = GameState.locations
  const people = GameState.people
  const timestamps = GameState.timestamps
  const possibleSolutions = GameState.possibleSolutions
  const solutions = GameState.solutions
  const numberOfSolutionsExceeded = GameState.numberOfSolutionsExceeded

  const state = GameState.state
  const solution = solutions.length === 0 ? null : solutions[0]

  if (numberOfSolutionsExceeded) {
    console.log(numberOfSolutionsExceeded)
  } else {
    console.log(solutions.length)
    console.log(solutions.map(sol => JSON.stringify(sol)).includes(JSON.stringify(realSolution)));
  }

  return (
    <div>
      {(numberOfSolutionsExceeded || (possibleSolutions.length > 1 && solutions.length === 0)) && <div>There is not yet enough data to deduct the solution.</div>}
      {!numberOfSolutionsExceeded && solutions.length > 1 && <div>There is no unique solution, this is the first one found</div>}
      <table>
        <tbody>
        <tr>
          <td></td>
          <td>{timestamps[0]}</td>
          <td>{timestamps[1]}</td>
          <td>{timestamps[2]}</td>
          <td>{timestamps[3]}</td>
          <td>{timestamps[4]}</td>
          <td>{timestamps[5]}</td>
        </tr>
        {people.map((p, indexP) => {
          const rowData = []
          timestamps.map((t, indexT) => {
            let loc
            if (!numberOfSolutionsExceeded && solution !== null) {
              loc = solution[indexP][indexT]
            } else if (state[indexP][indexT] !== -1) {
              loc = state[indexP][indexT]
            }
            const known = state[indexP][indexT] !== -1
            rowData.push({ loc, known })
          })

          return (
            <tr key={indexP}>
              <td>{p}</td>
              {rowData.map((r, indexR) => {
                return <td key={indexR}  style={{ height: "5rem", width: "9rem", border: "1px solid black", padding: "0.5rem", color: r.known ? "red" : "white" }}>{locations[r.loc]}</td>
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}

export default App
