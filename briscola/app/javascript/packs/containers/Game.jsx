import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GameCreate from '../components/GameCreate'
import Spinner from 'react-bootstrap/Spinner'

const Game = props => {
  if (props.loadingInProgressGame) {
    return <Spinner animation="border" />;
  }

  if (props.gameId) {
    // in an active game
    if (props.inGame) {
      // // TODO
      return <div>In game {props.gameId}</div>;
    }
    // need to join a game
    return <div>Need to join game {props.gameId}</div>;
  }

  // want to start a game
  return <GameCreate />;
}

Game.PropTypes = {
  gameId: PropTypes.number,
}

Game.defaultProps = {
  inGame: false,
  loadingInProgressGame: false,
}

const mapStateToProps = (state, ownProps) => {
  const { activeGameReducer } = state
  const { loadingInProgressGame, gameId, inGame } = activeGameReducer || {
    loadingInProgressGame: false,
    gameId: undefined,
    inGame: false,
  }
  return {
    gameId: ownProps.gameId || gameId, // or that returned from the game state
    loadingInProgressGame,
    inGame,
  }
}

export default connect(mapStateToProps)(Game);
