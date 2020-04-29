import {
  CREATE_GAME,
  COMPLETED_CREATE_GAME,
  JOIN_GAME,
  COMPLETED_JOIN_GAME,
  COMPLETED_FETCH_GAME_STATE,
} from './actions'

function actOnActiveGame(state = {}, action) {
  switch (action.type) {
    case CREATE_GAME:
      return Object.assign({}, state, {
        loadingInProgressGame: true,
        inGame: false,
      })
    case COMPLETED_CREATE_GAME:
      return Object.assign({}, state, {
        loadingInProgressGame: false,
        gameId: action.gameId,
        playerId: action.playerId,
        inGame: true,
      })
    case JOIN_GAME:
      return Object.assign({}, state, {
        loadingInProgressGame: true,
        gameId: action.gameId,
        playerName: action.playerName,
        inGame: false,
      })
    case COMPLETED_JOIN_GAME:
      return Object.assign({}, state, {
        playerId: action.playerId,
        inGame: true,
      })
    case COMPLETED_FETCH_GAME_STATE:
      return Object.assign({}, state, {
        loadingInProgressGame: false,
        gameState: action.gameState,
      })
    default:
      return state
  }
}

export default actOnActiveGame
