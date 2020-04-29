import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Stage, Layer, Rect, Image, Text } from 'react-konva'
import PlayerInfos from './PlayerInfos'

import { doFetchGameState } from '../redux/actions'

const TableRect = props => {
  const xBorderSize = props.windowWidth / 8;
  const yBorderSize = props.windowHeight / 8;
  return (
    <Rect
      x={xBorderSize}
      y={yBorderSize}
      width={props.windowWidth - xBorderSize * 2}
      height={props.windowHeight - yBorderSize * 2}
      fill={'green'}
      shadowBlur={5}
    />
  );
}

class InGame extends React.Component {
  // set timeout to refetch state every 2 seconds
  componentDidMount() {
    this.timerID = setInterval(
      () => this.props.fetchGameState(this.props.gameId, this.props.playerId),
      2000
    );
  }

  componentWillUnmount() {
    // clear the fetching timer
    clearInterval(this.timerID);
  }

  render() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return (
      <div key="InPageDiv">
        <Stage width={windowWidth} height={windowHeight}>
          <Layer key="TableLayer">
            <TableRect windowWidth={windowWidth} windowHeight={windowHeight} />
            {this.props.gameState.all_players_joined ? null : <Text x={windowWidth / 4} y={windowHeight / 2} text="Waiting for more players to join..." />}
          </Layer>
          <Layer key="PlayerLayer">
            <PlayerInfos
              windowWidth={windowWidth}
              windowHeight={windowHeight}
              playerId={this.props.playerId}
              myPosition={this.props.gameState.my_position}
              players={this.props.gameState.players}
              numPlayers={this.props.gameState.num_players}
            />
          </Layer>
          <Layer key="BiddingLayer">
          </Layer>
          <Layer key="ScoringLayer">
          </Layer>
          <Layer key="CardsLayer">
          </Layer>
          <Layer key="MiscLayer">
          </Layer>
        </Stage>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { activeGameReducer } = state
  const { gameState } = activeGameReducer || { gameState: {} }
  return {
    gameState,
    gameId: ownProps.gameId,
    playerId: ownProps.playerId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameState: (gameId, playerId) => dispatch(doFetchGameState(gameId, playerId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InGame)
