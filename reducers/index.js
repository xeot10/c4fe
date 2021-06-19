import { combineReducers } from "redux";
import worldChat from "./worldChat";
import currentGame from "./currentGame";
import currentPlayer from "./currentPlayer";
import allGameRooms from "./allGameRooms";

const rootReducer = combineReducers({
	worldChat,
	currentGame,
	currentPlayer,
	allGameRooms
});

export default rootReducer;
