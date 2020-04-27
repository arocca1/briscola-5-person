import fetch from 'cross-fetch'
import axios from 'axios';

export const FETCH_GAME_TYPES = "FETCH_GAME_TYPES";
export const RECEIVE_GAME_TYPES = "RECEIVE_GAME_TYPES";
export const CREATE_GAME = "CREATE_GAME";
export const COMPLETED_CREATE_GAME = "COMPLETED_CREATE_GAME";


export const GET_GAME_STATE = "GET_GAME_STATE";
export const MAKE_BID = "MAKE_BID";
export const PASS_BID = "PASS_BID";
export const SET_PARTNER_CARD = "SET_PARTNER_CARD";
export const DEAL_CARDS = "DEAL_CARDS";
export const PLAY_CARD = "PLAY_CARD";

function requestGameTypes() {
  return {
    type: FETCH_GAME_TYPES,
    loadingGameTypes: true,
  }
}

function receiveGameTypes(gameTypes) {
  return {
    type: RECEIVE_GAME_TYPES,
    gameTypes,
    loadingGameTypes: false,
  }
}

export function fetchGameTypes() {
  return dispatch => {
    dispatch(requestGameTypes())
    return fetch(`${window.location.protocol}//${window.location.host}/games/get_supported_games`)
      .then(response => response.json())
      .then(json => dispatch(receiveGameTypes(json)))
  }
}

function createGame(gameName, playerName, gameToCreate) {
  return {
    type: CREATE_GAME,
    loadingInProgressGame: true,
    gameName,
    playerName,
    gameToCreate,
  }
}

function completeCreateGame(json) {
  return {
    type: COMPLETED_CREATE_GAME,
    loadingInProgressGame: false,
    gameId: json.game_id,
    playerId: json.player_id,
    inGame: true,
  }
}

export function createNewGame(gameName, playerName, gameToCreate) {
  return dispatch => {
    dispatch(createGame(gameName, playerName, gameToCreate))
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: `${window.location.protocol}//${window.location.host}/games`,
      data: {
        game_id: gameToCreate,
        player_name: playerName,
        active_game_name: gameName,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completeCreateGame(json)))
  }
}
