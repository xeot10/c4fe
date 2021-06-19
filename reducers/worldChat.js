const worldChat = (state = { players: [], messages: [] }, action) => {
	let { players, messages } = state;

	switch (action.type) {
		case "SET_GLOBAL_PLAYERS":
			return { players: action.players, messages };
		case "UPDATE_GLOBAL_PLAYERS":
			const { player } = action.player;
			if (action.player.update_type === "delete") {
				const idxFound = players.findIndex(
					p => p.player_name === player.player_name
				);
				players.splice(idxFound, 1);
				return { messages, players: [...players] };
			} else {
				return { messages, players: [...players, player] };
			}
		case "UPDATE_GLOBAL_MESSAGES":
			return { players, messages: [...messages, action.message] };
		case "UPDATE_GLOBAL_CHAT":
			return { players: action.players, messages: action.messages };
		case "LOGOUT_USER":
			return { players: [], messages: [] };
		default:
			return state;
	}
};

export default worldChat;
