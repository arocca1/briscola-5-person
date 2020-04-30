import fetch from 'cross-fetch'
import axios from 'axios';

import { baseUrl } from '../util'

export const FETCH_GAME_TYPES = "FETCH_GAME_TYPES";
export const RECEIVE_GAME_TYPES = "RECEIVE_GAME_TYPES";
export const CREATE_GAME = "CREATE_GAME";
export const COMPLETED_CREATE_GAME = "COMPLETED_CREATE_GAME";
export const JOIN_GAME = "JOIN_GAME";
export const COMPLETED_JOIN_GAME = "COMPLETED_JOIN_GAME"
export const FETCH_GAME_STATE = "FETCH_GAME_STATE";
export const COMPLETED_FETCH_GAME_STATE = "COMPLETED_FETCH_GAME_STATE";
export const SET_BID = "SET_BID";
export const MAKE_BID = "MAKE_BID";
export const COMPLETED_MAKE_BID = "COMPLETED_MAKE_BID";
export const PASS_BID = "PASS_BID";
export const COMPLETED_PASS_BID = "COMPLETED_PASS_BID";
export const SELECT_CARD = "SELECT_CARD";
export const SET_PARTNER_CARD_SUIT = "SET_PARTNER_CARD_SUIT";
export const SET_PARTNER_CARD_RAW_VALUE = "SET_PARTNER_CARD_RAW_VALUE";
export const SET_PARTNER_CARD = "SET_PARTNER_CARD";
export const COMPLETED_SET_PARTNER_CARD = "COMPLETED_SET_PARTNER_CARD";
export const PLAY_CARD = "PLAY_CARD";
export const COMPLETED_PLAY_CARD = "COMPLETED_PLAY_CARD";

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
    return fetch(`${baseUrl()}/games/get_supported_games`)
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
      url: '/games',
      baseURL: baseUrl(),
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

function joinGame(gameId, playerName) {
  return {
    type: JOIN_GAME,
    loadingInProgressGame: true,
    gameId,
    playerName,
    inGame: false,
  }
}

function completeJoinGame(json) {
  return {
    type: COMPLETED_JOIN_GAME,
    loadingInProgressGame: false,
    gameState: json.game_state,
    playerId: json.game_state.id,
    inGame: true,
  }
}

export function doJoinGame(gameId, playerName) {
  return dispatch => {
    dispatch(joinGame(gameId, playerName))
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: '/games/join',
      baseURL: baseUrl(),
      data: {
        game_id: gameId,
        player_name: playerName,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completeJoinGame(json)))
  }
}

function fetchGameState() {
  return {
    type: FETCH_GAME_STATE,
    inGame: true,
  }
}

function completeFetchGameState(json) {
  return {
    type: COMPLETED_FETCH_GAME_STATE,
    loadingInProgressGame: false,
    inGame: true,
    gameState: json.game_state,
  }
}

export function doFetchGameState(gameId, playerId) {
  return dispatch => {
    dispatch(fetchGameState())
    axios({
      method: 'get',
      url: '/games/show_json',
      baseURL: baseUrl(),
      params: {
        game_id: gameId,
        player_id: playerId,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completeFetchGameState(json)))
  }
}

export function setBid(bid) {
  return {
    type: SET_BID,
    bid,
  }
}

function makeBid(bid) {
  return {
    type: MAKE_BID,
    bid,
  }
}

function completeMakeBid(json) {
  return {
    type: COMPLETED_MAKE_BID,
    gameState: json.game_state,
  }
}

export function doMakeBid(gameId, playerId, bid) {
  return dispatch => {
    dispatch(makeBid(bid))
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: '/bids/make_bid',
      baseURL: baseUrl(),
      data: {
        game_id: gameId,
        player_id: playerId,
        bid: bid,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completeMakeBid(json)))
  }
}

function passBid() {
  return {
    type: PASS_BID,
    passed: true,
  }
}

function completePassBid(json) {
  return {
    type: COMPLETED_PASS_BID,
    gameState: json.game_state,
  }
}

export function doPassBid(gameId, playerId) {
  return dispatch => {
    dispatch(passBid())
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: '/bids/pass_bid',
      baseURL: baseUrl(),
      data: {
        game_id: gameId,
        player_id: playerId,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completePassBid(json)))
  }
}

export function selectCard(suitName, suitId, rawValue, cardName) {
  return {
    type: SELECT_CARD,
    suitName,
    suitId,
    rawValue,
    cardName,
  }
}

export function setPartnerSuit(suitId) {
  return {
    type: SET_PARTNER_CARD_SUIT,
    partnerCardSuitId: suitId,
  }
}

export function setPartnerCardRawValue(rawValue) {
  return {
    type: SET_PARTNER_CARD_RAW_VALUE,
    partnerCardRawValue: rawValue,
  }
}

function setPartnerCard(suitId, rawValue) {
  return {
    type: SET_PARTNER_CARD,
    partnerCardSuitId: suitId,
    partnerCardRawValue: rawValue,
  }
}

function completeSetPartnerCard(json) {
  return {
    type: COMPLETED_SET_PARTNER_CARD,
    gameState: json.game_state,
  }
}

export function doSetPartnerCard(gameId, playerId, suitId, rawValue) {
  return dispatch => {
    dispatch(setPartnerCard(suitId, rawValue))
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: '/bids/set_partner_card',
      baseURL: baseUrl(),
      data: {
        game_id: gameId,
        player_id: playerId,
        suit_id: suitId,
        raw_value: rawValue,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completeSetPartnerCard(json)))
  }
}

function playCard() {
  return {
    type: PLAY_CARD,
  }
}

function completePlayCard(json) {
  return {
    type: COMPLETED_PLAY_CARD,
    gameState: json.game_state,
  }
}

export function doPlayCard(gameId, playerId, suitId, rawValue) {
  return dispatch => {
    dispatch(playCard())
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    axios({
      method: 'post',
      url: '/play/play_card',
      baseURL: baseUrl(),
      data: {
        game_id: gameId,
        player_id: playerId,
        suit_id: suitId,
        raw_value: rawValue,
      },
      headers: {
        'X-CSRF-Token': csrf,
      },
    })
    .then(response => response.data)
    .then(json => dispatch(completePlayCard(json)))
  }
}
