const allGameRooms = (state = [], action) => {
	const rooms = [...state];

	switch (action.type) {
		case "SET_ALL_GAME_ROOMS":
			return action.room;
		case "UPDATE_GAME_ROOM_LIST":
			const { updateType, roomId } = action.room;
			if (updateType === "addRoom") {
				return [action.room, ...state];
			} else if (updateType === "deleteRoom") {
				const idxFound = state.findIndex(r => r.roomId === roomId);
				rooms.splice(idxFound, 1);
				return rooms;
			}
			break;
		case "UPDATE_A_GAME_ROOM":
			if (action.room.updateType === "updateRoom") {
				const idxFound = state.findIndex(r => r.roomId === action.room.roomId);
				rooms.splice(idxFound, 1, action.room);
				return rooms;
			}
			break;
		case "LOGOUT_USER":
			return [];
		default:
			return state;
	}
};

export default allGameRooms;
