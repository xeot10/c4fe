const initialState = {
	gridX: [
		[0, 0, 0, 0, 0, 0], // 0  Y Axis(ROW)
		[0, 0, 0, 0, 0, 0], // 1
		[0, 0, 0, 0, 0, 0], // 2
		[0, 0, 0, 0, 0, 0], // 3
		[0, 0, 0, 0, 0, 0], // 4
		[0, 0, 0, 0, 0, 0], // 5
		[0, 0, 0, 0, 0, 0]
		// 0, 1, 2, 3, 4, 5, 6 => X Axis(COLUMN)
	],
	prevSlot: [0, 0, 0],
	currentPlayer: null,
	status: "",
	messages: [],
	players: [null, null],
	winner: null
};

const currentGame = (state = initialState, action) => {
	const { prevSlot } = action.data || state;
	const gridCopy = [...state.gridX];
	if (prevSlot) gridCopy[prevSlot[0]][prevSlot[1]] = prevSlot[2];

	switch (action.type) {
		case "UPDATE_ACTIVE_GAME":
			return {
				gridX: gridCopy,
				currentPlayer: action.data.currentPlayer,
				messages: state.messages,
				status: action.data.status,
				players: state.players,
				prevSlot,
				winner: initialState.winner
			};
		case "UPDATE_INACTIVE_GAME":
			return {
				gridX: state.gridX,
				currentPlayer: state.currentPlayer,
				messages: state.messages,
				status: action.data.status,
				players: action.data.players,
				prevSlot: state.prevSlot,
				winner: null
			};
		case "UPDATE_ACTIVE_GAME_MSGS":
			return {
				...state,
				messages: [...state.messages, action.data]
			};
		case "REMATCH_GAME_RESET":
			return {
				gridX: [
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0]
				],
				currentPlayer: initialState.currentPlayer,
				messages: state.messages,
				status: "full",
				players: state.players,
				prevSlot: initialState.prevSlot,
				winner: null
			};
		case "GAME_OVER":
			return {
				...state,
				winner: action.data.winner
			};
		case "RESET_GRID":
			return {
				...state,
				gridX: [
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0]
				]
			};
		case "RESET_PLAYER_READY":
			return {
				...state,
				players: state.players.map(p => {
					p.isReady = false;
					return p;
				})
			};
		case "LEAVE_ACTIVE_GAME" || "LOGOUT_USER":
			return {
				gridX: [
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0]
				],
				prevSlot: [0, 0, 0],
				currentPlayer: null,
				status: "",
				messages: [],
				players: [null, null],
				winner: null
			};
		default:
			return state;
	}
};

export default currentGame;
