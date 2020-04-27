import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Game = props => {
/*  if (!props.game_id) {
    <GameStart />
  }*/
  return <div>Hello   fffffff {props.game_id}!</div>;
}

Game.PropTypes = {
  game_id: PropTypes.number,
}

Game.defaultProps = {}

function mapStateToProps(state, ownProps) {
  return {
    game_id: ownProps.game_id, // or that returned from the game state
  }
}

export default connect(mapStateToProps)(Game);
