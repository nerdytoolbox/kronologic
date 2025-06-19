export const KnownPossible = ({ data }) => {
	const { } = data;

	debugger
	return (
		<div style={{ height: "5rem", width: "9rem", border: "1px solid black", padding: "0.5rem" }}>
			{total !== null && <div>Total {total}</div>}
			{people.length > 0 && <div>People {people.map(k => k)}</div>}
		</div>
	)
}