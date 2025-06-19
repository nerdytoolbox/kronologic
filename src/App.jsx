import './App.css'
import { DANCE_HALL, FOYER, GALLERY, LOCATIONS, MAP, MUSIC_HALL, STAGE, STAIRCASE } from "./util/locations.js";
import { A, B, C, D, J, H, PEOPLE } from "./util/people.js";
import { TIMESTAMPS } from "./util/timestamps.js";
import { GameState3, LocationTimestampRecord } from "./gameState/GameState3.js";

function App() {

  const GameState = new GameState3(LOCATIONS, MAP, PEOPLE, TIMESTAMPS, [
    // Starting info
    new LocationTimestampRecord(MUSIC_HALL, 1, 2, A),
    new LocationTimestampRecord(MUSIC_HALL, 1, 2, B),
    new LocationTimestampRecord(FOYER, 1, 2, C),
    // new LocationTimestampRecord(GALLERY, 1, 1, D),
    new LocationTimestampRecord(FOYER, 1, null, J),
    new LocationTimestampRecord(DANCE_HALL, 1, 1, H),

    new LocationTimestampRecord(STAGE, 2, 3, A),
    new LocationTimestampRecord(STAGE, 2, null, B),
    new LocationTimestampRecord(STAIRCASE, 2, 1, C),
    new LocationTimestampRecord(STAGE, 2, null, D),
    new LocationTimestampRecord(GALLERY, 2, 1, J),
    new LocationTimestampRecord(MUSIC_HALL, 2, 1, H),

    new LocationTimestampRecord(MUSIC_HALL, 3, 1, A),
    new LocationTimestampRecord(GALLERY, 3, 1, B),
    new LocationTimestampRecord(FOYER, 3, 2, C),
    new LocationTimestampRecord(DANCE_HALL, 3, 1, D),
    // new LocationTimestampRecord(FOYER, 3, null, J),
    new LocationTimestampRecord(STAGE, 3, 1, H),

    new LocationTimestampRecord(STAGE, 4, 1, A),
    new LocationTimestampRecord(FOYER, 4, 1, B),
    new LocationTimestampRecord(STAIRCASE, 4, 1, C),
    // new LocationTimestampRecord(MUSIC_HALL, 4, 1, D),
    new LocationTimestampRecord(GALLERY, 4, 2, J),
    new LocationTimestampRecord(GALLERY, 4, null, H),

    new LocationTimestampRecord(DANCE_HALL, 5, 2, A),
    new LocationTimestampRecord(STAIRCASE, 5, 2, B),
    new LocationTimestampRecord(FOYER, 5, 1, C),
    new LocationTimestampRecord(DANCE_HALL, 5, null, D),
    new LocationTimestampRecord(STAGE, 5, 1, J),
    new LocationTimestampRecord(STAIRCASE, 5, null, H),

    new LocationTimestampRecord(MUSIC_HALL, 6, 1, A),
    new LocationTimestampRecord(GALLERY, 6, 2, B),
    new LocationTimestampRecord(GALLERY, 6, null, C),
    new LocationTimestampRecord(STAGE, 6, 1, D),
    new LocationTimestampRecord(DANCE_HALL, 6, 1, J),
    new LocationTimestampRecord(FOYER, 6, 1, H),
  ]);

  const locations = GameState.locations
  const people = GameState.people
  const timestamps = GameState.timestamps
  const solutions = GameState.solutions

  const state = solutions[0]

  if (Object.keys(state).length === 0) {
    return <div>No data available</div>;
  }

  return (
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
            rowData.push(state[indexP][indexT])
          })

          return (
            <tr key={indexP}>
              <td>{p}</td>
              {rowData.map((r, indexR) => {
                return <td key={indexR}  style={{ height: "5rem", width: "9rem", border: "1px solid black", padding: "0.5rem" }}>{locations[r]}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default App
