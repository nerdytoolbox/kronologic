import { KronologicSolver } from "./KronologicSolver.js";

export class FullSolver extends KronologicSolver {
	constructor(locations, map, people, timestamps, records) {
		super(locations, map, people, timestamps, records);
		this.solve(JSON.parse(JSON.stringify(this.state))); // Deep copy to avoid modifying the original state
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