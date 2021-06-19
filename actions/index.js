/// GLOBAL CHAT ACTIIONS
export const updateGlobalPlayers = player => ({
  type: 'UPDATE_GLOBAL_PLAYERS',
  player
});

export const setGlobalPlayers = players => ({
  type: 'SET_GLOBAL_PLAYERS',
  players
})

export const updateGlobalMessages = message => ({
  type: 'UPDATE_GLOBAL_MESSAGES',
  message
});

/// APPLICATION ACTION
export const logoutUser = () => ({
  type: 'LOGOUT_USER'
})

/// PLAYER INFO
export const saveCurrentPlayer = player => ({
  type: 'SAVE_PLAYER_INFO',
  player
})


/// GAME ROOMS ACTIONS
export const setAllGameRooms = room => ({
  type: 'SET_ALL_GAME_ROOMS',
  room
})

export const updateGameRoomList = room => ({
  type: 'UPDATE_GAME_ROOM_LIST',
  room
})

export const updateGameRoom = room => ({
  type: 'UPDATE_A_GAME_ROOM',
  room
})


/// IN GAME ACTIION
export const updateActiveGame = data => ({
  type: 'UPDATE_ACTIVE_GAME',
  data
})

export const updateInactiveGame = data => ({
  type: 'UPDATE_INACTIVE_GAME',
  data
})

export const leaveActiveGame = () => ({
  type: 'LEAVE_ACTIVE_GAME',
})

export const updateActiveGameMsgs = data => ({
  type: 'UPDATE_ACTIVE_GAME_MSGS',
  data
})

export const gameOver = data => ({
  type: 'GAME_OVER',
  data
})

export const rematchReset = () => ({
  type: 'REMATCH_GAME_RESET',
})

export const resetReady = () => ({
  type: 'RESET_PLAYER_READY',
})

export const resetGrid = () => ({
  type: 'RESET_GRID',
})
