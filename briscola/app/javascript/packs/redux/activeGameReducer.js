import {
  CREATE_GAME,
  COMPLETED_CREATE_GAME,
  JOIN_GAME,
  COMPLETED_JOIN_GAME,
  COMPLETED_FETCH_GAME_STATE,
  MAKE_BID,
  COMPLETED_MAKE_BID,
  PASS_BID,
  COMPLETED_PASS_BID,
  SET_PARTNER_CARD,
  COMPLETED_SET_PARTNER_CARD,
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
        gameState: action.gameState,
        loadingInProgressGame: false,
        inGame: true,
      })
    case COMPLETED_FETCH_GAME_STATE:
      return Object.assign({}, state, {
        loadingInProgressGame: false,
        gameState: action.gameState,
      })
    case MAKE_BID:
      return Object.assign({}, state, {
        bid: action.bid,
      })
    case PASS_BID:
      return Object.assign({}, state, {
        passed: true,
      })
    case SET_PARTNER_CARD:
      return Object.assign({}, state, {
        suitId: action.suitId,
        rawValue: action.rawValue,
      })
    case COMPLETED_MAKE_BID:
    case COMPLETED_PASS_BID:
    case COMPLETED_SET_PARTNER_CARD:
      return Object.assign({}, state, {
        gameState: action.gameState,
      })
    default:
      return state
  }
}

export default actOnActiveGame
