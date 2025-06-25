import { DANCE_HALL, FOYER, GALLERY, MUSIC_HALL, STAGE, STAIRCASE } from "../constants/locations.js";
import { LocationPersonRecord, LocationTimestampRecord } from "../util/useKronologicSolver.jsx";
import { A, B, C, D, H, J } from "../constants/people.js";

/*
	Each row: Person (A, B, C, D, J, H)
	Each column: Timestamp (1, 2, 3, 4, 5, 6)
*/
export const solution = [
	[MUSIC_HALL, STAGE, MUSIC_HALL, STAGE, DANCE_HALL, MUSIC_HALL],
	[MUSIC_HALL, STAGE, GALLERY, FOYER, STAIRCASE, GALLERY],
	[FOYER, STAIRCASE, FOYER, STAIRCASE, FOYER, GALLERY],
	[GALLERY, STAGE, DANCE_HALL, MUSIC_HALL, DANCE_HALL, STAGE],
	[FOYER, GALLERY, FOYER, GALLERY, STAGE, DANCE_HALL],
	[DANCE_HALL, MUSIC_HALL, STAGE, GALLERY, STAIRCASE, FOYER]
]

/*
	Starter information
*/
export const starterInformation = [
	new LocationTimestampRecord(MUSIC_HALL, 1, null, A),
	new LocationTimestampRecord(MUSIC_HALL, 1, null, B),
	new LocationTimestampRecord(FOYER, 1, null, C),
	new LocationTimestampRecord(GALLERY, 1, null, D),
	new LocationTimestampRecord(FOYER, 1, null, J),
	new LocationTimestampRecord(DANCE_HALL, 1, null, H),
]

/*
	Each row: Location (DANCE_HALL, MUSIC_HALL, STAGE, GALLERY, STAIRCASE, FOYER)
	Each column: Person (A, B, C, D, J, H)
*/
export const locationPersonInformation = [
	[
		new LocationPersonRecord(DANCE_HALL, A, 1, 5),
		new LocationPersonRecord(DANCE_HALL, B, 0, null),
		new LocationPersonRecord(DANCE_HALL, C, 0, null),
		new LocationPersonRecord(DANCE_HALL, D, 2, 3),
		new LocationPersonRecord(DANCE_HALL, J, 1, 6),
		new LocationPersonRecord(DANCE_HALL, H, 1, null)
	],
	[
		new LocationPersonRecord(MUSIC_HALL, A, 3, 3),
		new LocationPersonRecord(MUSIC_HALL, B, 1, null),
		new LocationPersonRecord(MUSIC_HALL, C, 0, null),
		new LocationPersonRecord(MUSIC_HALL, D, 1, 4),
		new LocationPersonRecord(MUSIC_HALL, J, 0, null),
		new LocationPersonRecord(MUSIC_HALL, H, 1, 2)
	],
	[
		new LocationPersonRecord(STAGE, A, 2, 2),
		new LocationPersonRecord(STAGE, B, 1, 2),
		new LocationPersonRecord(STAGE, C, 0, null),
		new LocationPersonRecord(STAGE, D, 2, 6),
		new LocationPersonRecord(STAGE, J, 1, 5),
		new LocationPersonRecord(STAGE, H, 1, 3)
	],
	[
		new LocationPersonRecord(GALLERY, A, 0, null),
		new LocationPersonRecord(GALLERY, B, 2, 6),
		new LocationPersonRecord(GALLERY, C, 1, 6),
		new LocationPersonRecord(GALLERY, D, 1, null),
		new LocationPersonRecord(GALLERY, J, 2, 4),
		new LocationPersonRecord(GALLERY, H, 1, 4)
	],
	[
		new LocationPersonRecord(STAIRCASE, A, 0, null),
		new LocationPersonRecord(STAIRCASE, B, 1, 5),
		new LocationPersonRecord(STAIRCASE, C, 2, 2),
		new LocationPersonRecord(STAIRCASE, D, 0, null),
		new LocationPersonRecord(STAIRCASE, J, 0, null),
		new LocationPersonRecord(STAIRCASE, H, 1, 5)
	],
	[
		new LocationPersonRecord(FOYER, A, 0, null),
		new LocationPersonRecord(FOYER, B, 1, 4),
		new LocationPersonRecord(FOYER, C, 3, 5),
		new LocationPersonRecord(FOYER, D, 0, null),
		new LocationPersonRecord(FOYER, J, 2, 3),
		new LocationPersonRecord(FOYER, H, 1, 6)
	]
]

/*
	Each row: Location (DANCE_HALL, MUSIC_HALL, STAGE, GALLERY, STAIRCASE, FOYER)
	Each column: Timestamp (1, 2, 3, 4, 5, 6)
*/
export const locationTimestampInformation = [
	[
		new LocationTimestampRecord(DANCE_HALL, 1, 1, null),
		new LocationTimestampRecord(DANCE_HALL, 2, 0, null),
		new LocationTimestampRecord(DANCE_HALL, 3, 1, D),
		new LocationTimestampRecord(DANCE_HALL, 4, 0, null),
		new LocationTimestampRecord(DANCE_HALL, 5, 2, A),
		new LocationTimestampRecord(DANCE_HALL, 6, 1, J)
	],
	[
		new LocationTimestampRecord(MUSIC_HALL, 1, 2, null),
		new LocationTimestampRecord(MUSIC_HALL, 2, 1, H),
		new LocationTimestampRecord(MUSIC_HALL, 3, 1, A),
		new LocationTimestampRecord(MUSIC_HALL, 4, 1, D),
		new LocationTimestampRecord(MUSIC_HALL, 5, 0, null),
		new LocationTimestampRecord(MUSIC_HALL, 6, 1, A)
	],
	[
		new LocationTimestampRecord(STAGE, 1, 0, null),
		new LocationTimestampRecord(STAGE, 2, 3, D),
		new LocationTimestampRecord(STAGE, 3, 1, H),
		new LocationTimestampRecord(STAGE, 4, 1, A),
		new LocationTimestampRecord(STAGE, 5, 1, J),
		new LocationTimestampRecord(STAGE, 6, 1, D)
	],
	[
		new LocationTimestampRecord(GALLERY, 1, 1, null),
		new LocationTimestampRecord(GALLERY, 2, 1, J),
		new LocationTimestampRecord(GALLERY, 3, 1, B),
		new LocationTimestampRecord(GALLERY, 4, 2, H),
		new LocationTimestampRecord(GALLERY, 5, 0, null),
		new LocationTimestampRecord(GALLERY, 6, 2, C)
	],
	[
		new LocationTimestampRecord(STAIRCASE, 1, 0, null),
		new LocationTimestampRecord(STAIRCASE, 2, 1, C),
		new LocationTimestampRecord(STAIRCASE, 3, 0, null),
		new LocationTimestampRecord(STAIRCASE, 4, 1, C),
		new LocationTimestampRecord(STAIRCASE, 5, 2, H),
		new LocationTimestampRecord(STAIRCASE, 6, 0, null)
	],
	[
		new LocationTimestampRecord(FOYER, 1, 2, null),
		new LocationTimestampRecord(FOYER, 2, 0, null),
		new LocationTimestampRecord(FOYER, 3, 2, C),
		new LocationTimestampRecord(FOYER, 4, 1, B),
		new LocationTimestampRecord(FOYER, 5, 1, C),
		new LocationTimestampRecord(FOYER, 6, 1, H)
	]
]