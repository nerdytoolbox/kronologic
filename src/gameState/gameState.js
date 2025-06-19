

export class LocationPersonRecord {
	constructor(location, person, total, knownTimestamp) {
		this.location = location;
		this.person = person;
		this.total = total;
		this.knownTimestamp = knownTimestamp;
	}
}

/*
Steps:
1. Create a possible gameState including all possibilities
2. Remove impossible gameStates with the known records:
- Known: Person is at location L at timestamp T
		- remove this person from all other locations at this timestamp
		- using the movement MAP, determine where the person could and could not have been at the previous timestamp and the next timestamp
- Known: There are X people at location L at timestamp T
		- if there are already X people known at location L, remove all other possible people
- Known: Person P is X times at location L
		- if Person P has already been seen X times at location L, remove all other possible timestamps Person P could have been there
 */

export class GameState {
	constructor(locations, map, people, timestamps, records) {
		this.locations = locations;
		this.map = map;
		this.people = people;
		this.timestamps = timestamps;
		this.records = records;

		this.locTimeToPeople = new Map(); // Info about which people are at a location at a timestamp
		this.locPersonToTimes = new Map(); // Info about which timestamps a person is at a location
		this.personTimeToLocs = new Map(); // Info about which locations a person is at a timestamp (can only be one)

		this.initiateAllPossibilities()
		this.addKnownData();
		this.deduct();
	}

	key(...args) {
		return args.join('||');
	}

	initiateAllPossibilities() {
		for (const p of this.people) {
			for (const l of this.locations) {
				for (const t of this.timestamps) {
					this.locTimeToPeople.set(this.key(l, t), { total: null, known: [], possible: [...this.people] });
					this.locPersonToTimes.set(this.key(l, p), { total: null, known: [], possible: [...this.timestamps] });
					this.personTimeToLocs.set(this.key(p, t), { total: 1, known: [], possible: [...this.locations] });
				}
			}
		}
	}

	addKnownData() {
		this.records.forEach(record => {
			if (record instanceof LocationTimestampRecord) {
				this.addLocationTimestampRecord(record);
			}
		});
	}

	addLocationTimestampRecord(record) {
		const { location, timestamp, total, person } = record;
		const key = this.key(location, timestamp);

		// Set the total number of people at this location at this timestamp
		this.locTimeToPeople.get(key).total = total
		if (total === 0) {
			this.locTimeToPeople.get(key).possible = []
			return
		}

		// Add known data to the maps
		this.addToMaps(location, timestamp, person)

		// Deduct where the person could have been at the previous and next timestamps
		const notPossibleLocations = this.locations.filter(loc => !this.map[location].includes(loc));
		const prevTimestamp = timestamp - 1;
		const nextTimestamp = timestamp + 1;
		// Remove person from not possible locations at previous and next timestamps
		for (const notPossibleLocation of notPossibleLocations) {
			if (prevTimestamp >= this.timestamps[0]) {
				const prevKey = this.key(notPossibleLocation, prevTimestamp);
				const prevPeople = this.locTimeToPeople.get(prevKey);
				prevPeople.possible = prevPeople.possible.filter(p => p !== person);
			}
			if (nextTimestamp <= this.timestamps[this.timestamps.length - 1]) {
				const nextKey = this.key(notPossibleLocation, nextTimestamp);
				const nextPeople = this.locTimeToPeople.get(nextKey);
				nextPeople.possible = nextPeople.possible.filter(p => p !== person);
			}
		}
	}

	addToMaps(location, timestamp, person) {
		this.personIsKnown(location, timestamp, person);

		// Move this timestamp from possible to known for this person at this location
		const currentTimes = this.locPersonToTimes.get(this.key(location, person));
		currentTimes.possible = currentTimes.possible.filter(t => t !== timestamp);
		currentTimes.known.push(timestamp);

		// Move this location from possible to known for this person at this timestamp
		// As a person can only be at once location at a timestamp, we can clear the possible locations
		const currentLocs = this.personTimeToLocs.get(this.key(person, timestamp));
		currentLocs.possible = [];
		currentLocs.known.push(location);


	}

	personIsKnown(location, timestamp, person) {
		// Move this person from possible to known for this location and timestamp
		const currentPeople = this.locTimeToPeople.get(this.key(location, timestamp));
		currentPeople.possible = currentPeople.possible.filter(p => p !== person);
		currentPeople.known.push(person);

		// Remove person from all other locations at this timestamp
		this.locations.forEach(l => {
			if (l !== location) {
				const otherKey = this.key(l, timestamp);
				const otherPeople = this.locTimeToPeople.get(otherKey);
				otherPeople.possible = otherPeople.possible.filter(p => p !== person);
			}
		});
	}

	deduct() {
		// For each location and timestamp, if the total number is equal to the amount of known people, remove the possible people
		for (const l of this.locations) {
			for (const t of this.timestamps) {
				const key = this.key(l, t);
				const data = this.locTimeToPeople.get(key);
				if (data.total === null) {
					continue; // Skip if total is not set
				}
				if (data.known.length === data.total) {
					data.possible = [];
				// If the amount of known + possible people is equal to the total, move them to known
				} else if (data.known.length + data.possible.length === data.total) {
					for (const p2 of data.possible) {
						this.personIsKnown(l, t, p2)
					}
				}
			}
		}
	}
}