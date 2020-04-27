import {
  CREATE_GAME,
  COMPLETED_CREATE_GAME,
} from './actions'

function actOnActiveGame(state = {}, action) {
  switch (action.type) {
    case CREATE_GAME:
      return Object.assign({}, state, {
        loadingInProgressGame: true,
      })
    case COMPLETED_CREATE_GAME:
      return Object.assign({}, state, {
        loadingInProgressGame: false,
        gameId: action.gameId,
        playerId: action.playerId,
        inGame: true,
      })
    default:
      return state
  }
}

export default actOnActiveGame
