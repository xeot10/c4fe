const currentPlayer = (state = {}, action) => {
	switch (action.type) {
		case "SAVE_PLAYER_INFO":
			return action.player;
		case "LOGOUT_USER":
			return {};
		default:
			return state;
	}
};

export default currentPlayer;
