import { LocationPersonRecord, LocationTimestampRecord } from "./useKronologicSolver.jsx";

export class KronologicSolver {
	constructor(locations, map, people, timestamps, records) {
		this.locations = locations;
		this.map = map;
		this.people = people;
		this.timestamps = timestamps;
		this.records = records;
		this.showErrors = false;

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
			const iLocation = this.locations.findIndex(l => l === record.location);
			const iPerson = this.people.findIndex(p => p === record.person);
			const iTime = this.timestamps.findIndex(t => t === record.timestamp);
			if (iPerson !== -1 && iTime !== -1 && iLocation !== -1) {
				this.state[iPerson][iTime] = iLocation;
			}

			if (record instanceof LocationTimestampRecord) {
				if (record.total !== null && iLocation !== -1 && iTime !== -1) {
					this.locTimeTotalPeople[iLocation][iTime] = record.total;
				}
			} else if (record instanceof LocationPersonRecord) {
				if (record.total !== null && iLocation !== -1 && iPerson !== -1) {
					this.locPersonTotalLocations[iLocation][iPerson] = record.total;
				}
			}
		});
	}

	// Solver
	isValid(state, iPerson, iTime, iLocation) {
		// Check the previous and next timestamp
		const previousLocation = state[iPerson][iTime-1]
		if (previousLocation != null && previousLocation !== -1 && !this.map[this.locations[previousLocation]].includes(this.locations[iLocation])) {
			if (this.showErrors) {
				console.warn("Invalid move: not adjacent to previous location")
			}
			return false;
		}
		const nextLocation = state[iPerson][iTime+1];
		if (nextLocation != null && nextLocation !== -1 && !this.map[this.locations[iLocation]].includes(this.locations[nextLocation])) {
			if (this.showErrors) {
				console.warn("Invalid move: not adjacent to next location")
			}
			return false;
		}

		// Check the total of people in the location at this timestamp
		const peopleInLocationAtTime = []
		for (let i = 0; i < this.people.length; i++) {
			if (state[i][iTime] === iLocation) {
				peopleInLocationAtTime.push(i);
			}
		}
		if (this.locTimeTotalPeople[iLocation][iTime] !== -1 && peopleInLocationAtTime.length >= this.locTimeTotalPeople[iLocation][iTime]) {
			if (this.showErrors) {
				console.warn("Invalid move: location already has enough people at this timestamp")
			}
			return false;
		}

		// Check the total times a person has been in this location
		const totalTimesInLocation = []
		for (let i = 0; i < this.timestamps.length; i++) {
			if (state[iPerson][i] === iLocation) {
				totalTimesInLocation.push(i);
			}
		}
		if (this.locPersonTotalLocations[iLocation][iPerson] !== -1 && totalTimesInLocation.length >= this.locPersonTotalLocations[iLocation][iPerson]) {
			if (this.showErrors) {
				console.warn("Invalid move: person has already been in this location enough times")
			}
			return false;
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
		if (this.isCompleteState(state) && this.isCompleteAndValidState(state)) {
			this.solutions.push(JSON.parse(JSON.stringify(state)));
			if (this.solutions.length > 20) {
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