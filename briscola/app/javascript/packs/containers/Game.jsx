import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GameCreate from '../components/GameCreate'
import GameJoin from '../components/GameJoin'
import InGame from '../components/InGame'
import Spinner from 'react-bootstrap/Spinner'

const Game = props => {
  if (props.loadingInProgressGame) {
    return <Spinner animation="border" />;
  }

  if (props.gameId) {
    // in an active game
    if (props.inGame) {
      return <InGame playerId={props.playerId} gameId={props.gameId} />;
    }
    // need to join a game
    return <GameJoin gameId={props.gameId} />;
  }

  // want to start a game
  return <GameCreate />;
}

Game.PropTypes = {
  gameId: PropTypes.number,
  inGame: PropTypes.bool.isRequired,
  loadingInProgressGame: PropTypes.bool.isRequired,
  playerId: PropTypes.number,
}

Game.defaultProps = {
  inGame: false,
  loadingInProgressGame: false,
}

const mapStateToProps = (state, ownProps) => {
  const { activeGameReducer } = state
  const { loadingInProgressGame, gameId, playerId, inGame } = activeGameReducer || {
    loadingInProgressGame: false,
    gameId: undefined,
    playerId: undefined,
    inGame: false,
  }
  return {
    gameId: ownProps.gameId || gameId, // or that returned from the game state
    playerId,
    loadingInProgressGame,
    inGame,
  }
}

export default connect(mapStateToProps)(Game);
