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

	totalsConform(state) {
		// If for a timestamp, each person whereabouts is known, check if the number of people in a location matches the total required
		for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
			const peopleAtTime = []
			for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
				if (state[iPerson][iTime] !== -1) {
					peopleAtTime.push(state[iPerson][iTime]);
				}
			}
			if (peopleAtTime.length === this.people.length) {
				for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
					const totalPeopleInLocation = peopleAtTime.filter(loc => loc === iLocation).length;
					if (this.locTimeTotalPeople[iLocation][iTime] !== -1 && totalPeopleInLocation !== this.locTimeTotalPeople[iLocation][iTime]) {
						return false; // Not enough or too many people in this location at this timestamp
					}
				}
			}
		}

		// If for a person, the whole path is known, check if the number of times they have been in each location matches the total required
		for (let iPerson = 0; iPerson < this.people.length; iPerson++) {
			const pathOfPerson = []
			for (let iTime = 0; iTime < this.timestamps.length; iTime++) {
				if (state[iPerson][iTime] !== -1) {
					pathOfPerson.push(state[iPerson][iTime]);
				}
			}
			if (pathOfPerson.length === this.timestamps.length) {
				for (let iLocation = 0; iLocation < this.locations.length; iLocation++) {
					const timesAtLocation = pathOfPerson.filter(loc => loc === iLocation).length;
					if (this.locPersonTotalLocations[iLocation][iPerson] !== -1 && timesAtLocation !== this.locPersonTotalLocations[iLocation][iPerson]) {
						return false; // Not enough or too many people in this location at this timestamp
					}
				}
			}
		}

		return true; // All totals conform to the requirements
	}
}