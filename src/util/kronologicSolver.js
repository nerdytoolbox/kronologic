export function kronologicSolver(board) {
	const isValid = (board, row, col, num) => {
		for (let i = 0; i < 9; i++) {
			// Check row and column
			if (board[row][i] === num || board[i][col] === num) return false;

			// Check 3x3 subgrid
			const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
			const boxCol = 3 * Math.floor(col / 3) + (i % 3);
			if (board[boxRow][boxCol] === num) return false;
		}
		return true;
	};

	const solve = () => {
		for (let iPerson = 0; iPerson < 6; iPerson++) {
			for (let iTime = 0; iTime < 6; iTime++) {
				if (board[iPerson][iTime] === 0) {
					for (let num = 1; num <= 9; num++) {
						if (isValid(board, iPerson, iTime, num)) {
							board[iPerson][iTime] = num;
							if (solve()) return true;
							board[iPerson][iTime] = 0;
						}
					}
					return false; // No valid number found
				}
			}
		}
		return true; // All cells filled correctly
	};

	solve();
	return board;
}
