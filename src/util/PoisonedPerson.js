import { KronologicSolver } from "./KronologicSolver.js";

export class PoisonedPerson extends KronologicSolver {
	constructor(locations, map, people, timestamps, records) {
		super(locations, map, people, timestamps, records);
		this.solve(JSON.parse(JSON.stringify(this.state))); // Deep copy to avoid modifying the original state
	}



	solve(state) {
		if (

		) {
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