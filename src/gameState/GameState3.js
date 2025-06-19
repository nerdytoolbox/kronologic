import { LOCATIONS } from "../util/locations.js";
import { TIMESTAMPS } from "../util/timestamps.js";
import { PEOPLE } from "../util/people.js";

export class LocationTimestampRecord {
	constructor(location, timestamp, totalPeople, person) {
		this.iLocation = LOCATIONS.findIndex(l => l === location);
		this.iTime = TIMESTAMPS.findIndex(t => t === timestamp);
		this.iPerson = PEOPLE.findIndex(p => p === person);
		this.total = totalPeople;
	}
}

export class LocationPersonRecord {
	constructor(location, person, totalTimes, timestamp) {
		this.iLocation = LOCATIONS.findIndex(l => l === location);
		this.iTime = TIMESTAMPS.findIndex(t => t === timestamp);
		this.iPerson = PEOPLE.findIndex(p => p === person);
		this.total = totalTimes;
	}
}

export class GameState3 {
	constructor(locations, map, people, timestamps, records) {
		this.locations = locations;
		this.map = map;
		this.people = people;
		this.timestamps = timestamps;
		this.records = records;

		this.state = []
		this.locTimeTotalPeople = []
		this.locPersonTotalLocations = [];
		this.initialiseState()
		this.addRecords()
		this.solutions = []
		this.solve(JSON.parse(JSON.stringify(this.state))); // Deep copy to avoid modifying the original state
	}

	initialiseState() {
		this.initialiseGridWithZeros(this.state, this.people, this.timestamps)
		this.initialiseGridWithZeros(this.locTimeTotalPeople, this.locations, this.timestamps);
		this.initialiseGridWithZeros(this.locPersonTotalLocations, this.locations, this.people);
	}

	initialiseGridWithZeros(grid, list1, list2) {
		for (let i = 0; i < list1.length; i++) {
			grid[i] = [];
			for (let j = 0; j < list2.length; j++) {
				grid[i][j] = -1;
			}
		}
	}

	addRecords() {
		this.records.forEach(record => {
			if (record instanceof LocationTimestampRecord) {
				this.state[record.iPerson][record.iTime] = record.iLocation;
				this.locTimeTotalPeople[record.iLocation][record.iTime] = record.total;
			} else if (record instanceof LocationPersonRecord) {
				this.state[record.iPerson][record.iTime] = record.iLocation;
				this.locPersonTotalLocations[record.iLocation][record.iPerson] = record.total;
			}
		});
	}

	// Solver
	isValid(state, iPerson, iTime, iLocation) {
		// Check the previous and next timestamp
		const previousLocation = state[iPerson][iTime-1]
		if (previousLocation != null && previousLocation !== -1 && !this.map[this.locations[previousLocation]].includes(this.locations[iLocation])) {
			return false; // Invalid move, not adjacent
		}
		const nextLocation = state[iPerson][iTime+1];
		if (nextLocation != null && nextLocation !== -1 && !this.map[this.locations[iLocation]].includes(this.locations[nextLocation])) {
			return false; // Invalid move, not adjacent
		}

		// Check the total of people in the location at this timestamp
		const peopleInLocationAtTime = []
		for (let i = 0; i < this.people.length; i++) {
			if (state[i][iTime] === iLocation) {
				peopleInLocationAtTime.push(i);
			}
		}
		if (this.locTimeTotalPeople[iLocation][iTime] !== -1 && peopleInLocationAtTime.length >= this.locTimeTotalPeople[iLocation][iTime]) {
			return false; // There are already enough people in this location at this timestamp
		}

		// Check the total times a person has been in this location
		const totalTimesInLocation = []
		for (let i = 0; i < this.timestamps.length; i++) {
			if (state[iPerson][i] === iLocation) {
				totalTimesInLocation.push(i);
			}
		}
		if (this.locPersonTotalLocations[iLocation][iPerson] !== -1 && totalTimesInLocation.length >= this.locPersonTotalLocations[iLocation][iPerson]) {
			return false; // This person has already been in this location enough times
		}

		return true;
	}

	solve(state) {
		for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
			for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
				if (state[iPerson][iTime] === -1) {
					for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
						if (this.isValid(state, iPerson, iTime, iLocation)) {
							state[iPerson][iTime] = iLocation;
							if (this.solve(state)) return true;
							state[iPerson][iTime] = 0;
						}
					}
					return false; // No valid number found
				}
			}
		}
		this.solutions.push(state)
		return true; // All cells filled correctly
	}
}