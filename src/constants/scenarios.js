// On person is dead, the murderer is the person who was alone with them at some point in time
export const CLASSIC = "CLASSIC"
// No one is dead, the murderer is the one who was alone at every timestamp
export const SOLITARY = "SOLITARY"
// The murderer was ALWAYS with two other people
export const CROWDED = "CROWDED"
// The murderer followed the victim for three consecutive timestamps
export const SEQUENTIAL = "SEQUENTIAL"
// There is a pair of murderers, they are at some point alone with the victim
export const PAIR = "PAIR"

export const SCENARIOS = [
	CLASSIC,
	SOLITARY,
	CROWDED,
	SEQUENTIAL,
	PAIR
]