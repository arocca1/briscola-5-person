import { CREATE_GAME, GET_GAME_STATE, MAKE_BID, PASS_BID, SET_PARTNER_CARD, DEAL_CARDS, PLAY_CARD } from "./actions";

const initialState = {
  allIds: [],
  byIds: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_GAME: {
      return state;
    }
    case GET_GAME_STATE: {
      return state;
    }
    case MAKE_BID: {
      return state;
    }
    case PASS_BID: {
      return state;
    }
    case SET_PARTNER_CARD: {
      return state;
    }
    case DEAL_CARDS: {
      return state;
    }
    case PLAY_CARD: {
      return state;
    }
    default:
      return state;
  }
}
