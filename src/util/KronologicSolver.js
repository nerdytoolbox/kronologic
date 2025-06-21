import { LOCATIONS } from "../constants/locations.js";
import { TIMESTAMPS } from "../constants/timestamps.js";
import { PEOPLE } from "../constants/people.js";

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

export class KronologicSolver {
	constructor(locations, map, people, timestamps, records) {
		this.locations = locations;
		this.map = map;
		this.people = people;
		this.timestamps = timestamps;
		this.records = records;

		// Initialize the current state of known information
		this.state = []
		this.locTimeTotalPeople = []
		this.locPersonTotalLocations = [];
		this.initialiseState()
		this.addRecords()

		// Solve the puzzle
		this.solutions = []
		this.numberOfSolutionsExceeded = false;
		this.solve(JSON.parse(JSON.stringify(this.state))); // Deep copy to avoid modifying the original state
	}

	// Initialize the state with known information
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
				if (record.iPerson !== -1) {
					this.state[record.iPerson][record.iTime] = record.iLocation;
				}
				if (record.total !== null) {
					this.locTimeTotalPeople[record.iLocation][record.iTime] = record.total;
				}
			} else if (record instanceof LocationPersonRecord) {
				if (record.iTime !== -1) {
					this.state[record.iPerson][record.iTime] = record.iLocation;
				}
				if (record.total !== null) {
					this.locPersonTotalLocations[record.iLocation][record.iPerson] = record.total;
				}
			}
		});
	}

	// Solver
	isValid(state, iPerson, iTime, iLocation) {
		// Check the previous and next timestamp
		const previousLocation = state[iPerson][iTime-1]
		if (previousLocation != null && previousLocation !== -1 && !this.map[this.locations[previousLocation]].includes(this.locations[iLocation])) {
			// TODO: Show errors, but only when showError is true
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

	isCompleteState(state) {
		for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
			for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
				if (state[iPerson][iTime] === -1) {
					return false; // At least one cell is not filled
				}
			}
		}
		return true
	}

	isCompleteAndValidState(state) {
		// For every location at every timestamp, check if the number of people matches the total required
		for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
			for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
				const peopleInLocationAtTime = [];
				for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
					if (state[iPerson][iTime] === iLocation) {
						peopleInLocationAtTime.push(iPerson);
					}
				}
				if (this.locTimeTotalPeople[iLocation][iTime] !== -1 && peopleInLocationAtTime.length !== this.locTimeTotalPeople[iLocation][iTime]) {
					return false; // Not enough or too many people in this location at this timestamp
				}
			}
		}

		// For every person, check if the number of times they have been in each location matches the total required
		for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
			for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
				const totalTimesInLocation = [];
				for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
					if (state[iPerson][iTime] === iLocation) {
						totalTimesInLocation.push(iTime);
					}
				}
				if (this.locPersonTotalLocations[iLocation][iPerson] !== -1 && totalTimesInLocation.length !== this.locPersonTotalLocations[iLocation][iPerson]) {
					return false; // This person has not been in this location enough times
				}
			}
		}
		return true; // All cells are filled
	}

	solve(state) {
		// Base case: if all cells are filled, check if the state is valid and add to solutions
		if (this.isCompleteState(state) && this.isCompleteAndValidState(state)) {
			this.solutions.push(JSON.parse(JSON.stringify(state)));
			if (this.solutions.length > 10) {
				this.numberOfSolutionsExceeded = true;
			}
			return
		}

		for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
			for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
				if (state[iPerson][iTime] === -1) {
					for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
						if (this.isValid(state, iPerson, iTime, iLocation)) {
							state[iPerson][iTime] = iLocation;
							this.solve(state);
							if (this.numberOfSolutionsExceeded) {
								return
							}
							state[iPerson][iTime] = -1; // Backtrack
						}
					}
					return
				}
			}
		}
	}
}