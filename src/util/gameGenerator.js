import { LOCATIONS, MAP } from "./locations.js";
import { PEOPLE } from "./people.js";
import { TIMESTAMPS } from "./timestamps.js";

const getRandomElement = (array) => {
	return array[Math.floor(Math.random() * array.length)];
}

const generateValidPath = (startLocation) => {
	const path = [startLocation];
	let current = startLocation;
	for (let t = 1; t < TIMESTAMPS.length; t++) {
		const nextOptions = MAP[current].filter(loc => loc !== path[t - 1]);
		const next = getRandomElement(nextOptions);
		path.push(next);
		current = next;
	}
	return path;
}

const generateMovement = () => {
	const personPaths = {};
	PEOPLE.forEach(person => {
		const start = getRandomElement(LOCATIONS);
		let path;
		do {
			path = generateValidPath(start);
		} while (path.some((loc, i) => i > 0 && loc === path[i - 1]));
		personPaths[person] = path;
	});
	return personPaths;
}

const determineMurdererScenario = (movements) => {
	const victim = getRandomElement(PEOPLE);
	let murderer = null;
	let timestamp = -1;

	// Find a person who was alone with the victim at some timestamp
	for (let t of TIMESTAMPS) {
		const peopleAtSamePlace = Object.entries(movements)
			.filter(([p, path]) => path[t] === movements[victim][t]);

		if (peopleAtSamePlace.length === 2) {
			const suspect = peopleAtSamePlace.find(([p]) => p !== victim);
			if (suspect) {
				murderer = suspect[0];
				timestamp = t;
				break;
			}
		}
	}

	if (!murderer) return null; // No valid scenario

	return {
		victim,
		murderer,
		timeOfPoisoning: timestamp,
	};
}

const cacheQueryResults = (movements) => {
	const queryCache = {
		locationPerson: {},
		locationTimestamp: {},
	};

	for (const location of LOCATIONS) {
		for (const person of PEOPLE) {
			const times = TIMESTAMPS.filter(t => movements[person][t] === location);
			if (times.length > 0) {
				queryCache.locationPerson[`${location}_${person}`] = {
					count: times.length,
					exampleTimestamp: getRandomElement(times),
				};
			}
		}
		for (const t of TIMESTAMPS) {
			const peopleThere = PEOPLE.filter(p => movements[p][t] === location);
			if (peopleThere.length > 0) {
				queryCache.locationTimestamp[`${location}_${t}`] = {
					count: peopleThere.length,
					examplePerson: getRandomElement(peopleThere),
				};
			}
		}
	}
	return queryCache;
}

export function generateGame() {
	let movements;
	let scenario;
	let queryCache;

	do {
		movements = generateMovement();
		scenario = determineMurdererScenario(movements);
		if (scenario) {
			queryCache = cacheQueryResults(movements);
		}
	} while (!scenario || !isGameSolvable({ movements, scenario, queryCache }));

	return {
		map: MAP,
		people: PEOPLE,
		locations: LOCATIONS,
		timestamps: TIMESTAMPS,
		movements,
		scenario,
		queryCache,
	};
}

export const queryLocationWithPerson = (gameData, location, person) => {
	const key = `${location}_${person}`;
	const result = gameData.queryCache.locationPerson[key];
	if (!result) return { count: 0, exampleTimestamp: null };
	return result;
}

export const queryLocationWithTimestamp = (gameData, location, timestamp) => {
	const key = `${location}_${timestamp}`;
	const result = gameData.queryCache.locationTimestamp[key];
	if (!result) return { count: 0, examplePerson: null };
	return result;
}

// Verifies there is exactly one valid solution
export function isGameSolvable(gameData) {
	const { movements, scenario } = gameData;
	const { victim, timeOfPoisoning } = scenario;
	const location = movements[victim][timeOfPoisoning];

	const suspects = Object.entries(movements).filter(([p, path]) => {
		return p !== victim && path[timeOfPoisoning] === location;
	});

	// Must be exactly one person with the victim at that timestamp
	return suspects.length === 1 && suspects[0][0] === scenario.murderer;
}