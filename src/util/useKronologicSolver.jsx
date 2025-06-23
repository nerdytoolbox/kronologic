import { useState, useCallback, useEffect } from "react";
import { KronologicSolver } from "./KronologicSolver";

export class LocationTimestampRecord {
	constructor(location, timestamp, totalPeople, person) {
		this.location = location;
		this.timestamp = timestamp;
		this.person = person;
		this.total = totalPeople;
	}
}

export class LocationPersonRecord {
	constructor(location, person, totalTimes, timestamp) {
		this.location = location;
		this.person = person;
		this.timestamp = timestamp;
		this.total = totalTimes;
	}
}

export function useKronologicSolver(locations, map, people, timestamps) {
	const [records, setRecords] = useState([]);
	const [state, setState] = useState([])
	const [solutions, setSolutions] = useState([]);
	const [numberOfSolutionsExceeded, setNumberOfSolutionsExceeded] = useState(false);

	const addRecord = useCallback((record) => {
		setRecords(prev => [...prev, record]);
	}, []);

	useEffect(() => {
		const solver = new KronologicSolver(locations, map, people, timestamps, records);
		setState(solver.state)
		setSolutions(solver.solutions);
		setNumberOfSolutionsExceeded(solver.numberOfSolutionsExceeded);
	}, [locations, map, people, timestamps, records]);

	return { records, addRecord, solutions, numberOfSolutionsExceeded, state };
}