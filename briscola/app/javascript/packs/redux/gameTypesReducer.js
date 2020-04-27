import {
  FETCH_GAME_TYPES,
  RECEIVE_GAME_TYPES,
} from './actions'

function gamesByType(state = {
    loadingGameTypes: true,
    gameTypes: [],
  },
  action
) {
  switch (action.type) {
    case FETCH_GAME_TYPES:
      return state
    case RECEIVE_GAME_TYPES:
      return Object.assign({}, state, {
        gameTypes: action.gameTypes,
        loadingGameTypes: false,
      })
    default:
      return state
  }
}

export default gamesByType
