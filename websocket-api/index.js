import openSocket from "socket.io-client";
import {
	handleWorldChat,
	handleAllWorldPlayers,
	handleAllGameRooms,
	handleGameRoomUpdate,
	handleActiveGameUpdate,
	handleDisconnect
} from "./handlers";

const socket = openSocket("https://connect-four-be.herokuapp.com/");

socket.on("world chat update", handleWorldChat);
socket.on("send world chat players", handleAllWorldPlayers);

socket.on("send all game rooms", handleAllGameRooms);
socket.on("game rooms update", handleGameRoomUpdate);
socket.on("disconnect", handleDisconnect);

export function sendWorldMessage(message) {
	socket.emit("broadcast to world chat", message);
}

export function leaveWorldChat() {
	socket.emit("leave world chat");
}

export function joinWorldChat(player) {
	socket.emit("join world chat", player);
}

export function getWorldChatPlayers() {
	socket.emit("get world chat players");
}

export function subscribeToWorldChat() {
	socket.on("world chat update", handleWorldChat);
}

export function registerClient(token) {
	socket.emit("register client", token);
}

export function removeClient(token) {
	socket.emit("remove client", token);
}

export function createNewGameRoom(name, password = "") {
	socket.emit("create game room", { name, password });
}

export function joinGameRoom(roomId, password = "") {
	socket.emit("join game room", { roomId, password });
}

export function leaveGame() {
	socket.emit("leave game room");
}

export function listenToActiveGame() {
	socket.on("active game update", handleActiveGameUpdate);
}

export function unsubscribeToActiveGame() {
	socket.removeListener("active game update");
}

export function setPlayerReady(data) {
	socket.emit("set player ready", data);
}

export function placePlayerChip(xCoordinate) {
	socket.emit("place player chip", xCoordinate);
}

export function sendInGameMessage(payload) {
	socket.emit("send in game message", payload);
}
