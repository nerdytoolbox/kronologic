export class LocationTimestampRecord {
	constructor(location, timestamp, total, person) {
		this.location = location;
		this.timestamp = timestamp;
		this.total = total;
		this.person = person;
	}
}

export class GameState2 {
	constructor(locations, map, people, timestamps, records) {
		this.locations = locations;
		this.map = map;
		this.people = people;
		this.timestamps = timestamps;
		this.records = records;

		this.state = {}
		this.locTimeToTotalPeople = {}
		this.locPersonToTotalTimes = {};
		this.initiateEmptyStates()
		this.addRecords();

		console.log(this.isSolution(this.state))
		//this.solutions = this.solve();
	}

	key(...args) {
		return args.join('||');
	}

	initiateEmptyStates() {
		for (const p of this.people) {
			for (const t of this.timestamps) {
				this.state[this.key(p, t)] = null;
			}
		}

		for (const l of this.locations) {
			for (const t of this.timestamps) {
				this.locTimeToTotalPeople[this.key(l, t)] = null;
			}
			for (const p of this.people) {
				this.locPersonToTotalTimes[this.key(l, p)] = null;
			}
		}
	}

	addRecords() {
		this.records.forEach(record => {
			if (record instanceof LocationTimestampRecord) {
				this.locTimeToTotalPeople[this.key(record.location, record.timestamp)] = record.total;
				if (record.person) {
					this.state[this.key(record.person, record.timestamp)] = this.locations.findIndex(loc => loc === record.location);
				}
			}
		});
	}

	solve() {
		// Save all solutions
		const solutions = [];

		const currentState = JSON.parse(JSON.stringify(this.state))

		let iPerson = 0;
		let iTime = 0;
		while (iPerson < this.people.length && iTime < this.timestamps.length) {
			let person = this.people[iPerson];
			let time = this.timestamps[iTime];

			let iLocation = 0;
			if (this.isValid(currentState, person, time, iLocation)) {
				currentState[this.key(person, time)] = iLocation;
				iTime++;
				iLocation = 0;
			} else {
				iLocation++;
			}

			if (iTime > this.timestamps.length - 1) {
				iTime = 0;
				iPerson++;
				iLocation = 0;
			}

			if (iPerson > this.people.length - 1) {
				if (this.isSolution(currentState)) {
					solutions.push(JSON.parse(JSON.stringify(currentState)));
					return solutions;
				}
			}
		}
	}

	isValid(state, person, time, location) {
		// Check if person is in unreachable locations at previous or next time
		const previousLocation = state[this.key(person, time - 1)];
		if (previousLocation !== null && !this.map[previousLocation].includes(location)) {
			console.log(`Person ${person} cannot move from ${previousLocation} to ${location} at time ${time}`);
			return false;
		}
		const nextLocation = state[this.key(person, time + 1)];
		if (nextLocation !== null && !this.map[location].includes(nextLocation)) {
			console.log(`Person ${person} cannot move from ${location} to ${nextLocation} at time ${time + 1}`);
			return false;
		}

		// Check if the amount of people at the location at this time is not exceeded
		const peopleAtLocationAtTime = []
		for (const p of this.people) {
			if (this.state[this.key(p, time)] === location) {
				peopleAtLocationAtTime.push(p);
			}
		}
		if (this.locTimeToTotalPeople[this.key(location, time)] !== null) {
			if (peopleAtLocationAtTime.length >= this.locTimeToTotalPeople[this.key(location, time)]) {
				console.log(`Location ${location} at time ${time} already has the maximum amount of people`);
				return false;
			}
		}

		// Check if the amount of times the person is at this location is not exceeded
		const timesForPersonAtLocation = []
		for (const t of this.timestamps) {
			if (state[this.key(person, t)] === location) {
				timesForPersonAtLocation.push(t);
			}
		}
		if (this.locPersonToTotalTimes[this.key(location, person)] !== null) {
			if (timesForPersonAtLocation.length >= this.locPersonToTotalTimes[this.key(location, person)]) {
				console.log(`Person ${person} is already at location ${location} the maximum amount of times`);
				return false;
			}
		}
	}

	isSolution(state) {
		if (!this.personPathsConform(state)) {
			return false;
		}
		if (!this.personTotalsConform(state)) {
			return false;
		}
		return this.timeTotalsConform(state);
	}

	personPathsConform(state) {
		for (const person of this.people) {
			const personPath = []
			for (const t of this.timestamps) {
				if (state[this.key(person, t)] === null) {
					console.log(`Person ${person} at time ${t} has no known location`);
					return false;
				} else {
					personPath.push(state[this.key(person, t)]);
				}
			}

			// Check if the path is valid
			for (let i = 1; i <= personPath.length - 1; i++) {
				const previousLocation = personPath[i-1];
				const currentLocation = personPath[i];
				if (!this.map[previousLocation].includes(currentLocation)) {
					console.log(`Invalid path for person ${person} at timestamp ${i} from ${previousLocation} to ${currentLocation}`);
					return false;
				}
			}
		}

		return true;
	}

	personTotalsConform(state) {
		const peopleAtLocationAtTime = {}
		for (const p of this.people) {
			for (const t of this.timestamps) {
				const l = state[this.key(p, t)];
				if (peopleAtLocationAtTime[this.key(l, t)] === undefined) {
					peopleAtLocationAtTime[this.key(l, t)] = [];
				}
				peopleAtLocationAtTime[this.key(l, t)].push(p);
				if (this.locTimeToTotalPeople[this.key(l, t)] !== null) {
					if (peopleAtLocationAtTime[this.key(l, t)].length !== this.locTimeToTotalPeople[this.key(l, t)]) {
						console.log(`Total amount of people at location ${l} at time ${t} is not right`);
						return false;
					}
				}
			}
		}
		return true;
	}

	timeTotalsConform(state) {
		const timesForPersonAtLocation = {}
		for (const p of this.people) {
			for (const t of this.timestamps) {
				const l = state[this.key(p, t)];
				if (timesForPersonAtLocation[this.key(p, l)] === undefined) {
					timesForPersonAtLocation[this.key(p, l)] = [];
				}
				timesForPersonAtLocation[this.key(p, l)].push(t)
				if (this.locPersonToTotalTimes[this.key(l, p)] !== null) {
					if (timesForPersonAtLocation[this.key(p, l)].length !== this.locPersonToTotalTimes[this.key(l, p)]) {
						console.log(`Person ${p} is at location ${l} not the correct amount of times`);
						return false;
					}
				}
			}
		}
		return true;
	}
}