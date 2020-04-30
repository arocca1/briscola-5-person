import React from 'react'
import PropTypes from 'prop-types'
import { Group, Text, Star } from 'react-konva'
import { isItPlayerTurn } from '../util'

const PlayerName = props => {
  // me
  let x = props.windowWidth / 2;
  let y = props.windowHeight * 19 / 20;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 19 / 20;
    y = 2 * props.windowHeight / 3;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 19 / 20;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth / 20;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth / 20;
    y = 2 * props.windowHeight / 3;
  } // the else case is me
  return <Text x={x} y={y} text={props.name} />;
}

PlayerName.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}

const PlayerBid = props => {
  // me
  let x = props.windowWidth / 2;
  let y = props.windowHeight * 18 / 20;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 17 / 20;
    y = 2 * props.windowHeight / 3;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 17 / 20;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth / 10;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth / 10;
    y = 2 * props.windowHeight / 3;
  } // the else case is me

  const bidKey = `${props.gameState.id}BidKey`;
  const playerBid = props.gameState.player_bids[(props.gameState.my_position + props.relativeToMe) % props.gameState.num_required_players];
  let playerText = "No bid yet";
  if (playerBid.passed) {
    playerText = "Passed";
  } else if (playerBid.bid) {
    playerText = `Bid Amount: ${playerBid.bid}`;
  }
  return <Text x={x} y={y} text={playerText} />;
}

PlayerBid.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
}

const PlayerTurn = props => {
  // me
  let x = props.windowWidth / 2;
  let y = props.windowHeight * 4 / 5;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 4 / 5;
    y = 2 * props.windowHeight / 3;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 4 / 5;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth / 5;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth / 5;
    y = 2 * props.windowHeight / 3;
  } // the else case is me

  if (isItPlayerTurn(props.gameState, props.relativeToMe)) {
    return (
      <Star
        x={x}
        y={y}
        fill="#89b717"
        numPoints={5}
        innerRadius={10}
        outerRadius={20}
      />
    );
  }
  return null;
}

PlayerTurn.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
}

const PlayerInfo = props => {
  let playerBid;
  if (props.gameState.requires_bidding && !props.gameState.bidding_done) {
    playerBid = (
      <PlayerBid
        key={`${props.name}BidKey`}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        gameState={props.gameState}
      />
    )
  }
  let playerTurn;
  if (props.gameState.all_players_joined) {
    playerTurn = (
      <PlayerTurn
        key={`${props.name}TurnKey`}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        gameState={props.gameState}
      />
    )
  }
  return (
    <Group>
      <PlayerName
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        name={props.name}
      />
      { playerBid }
      { playerTurn }
    </Group>
  )
}

PlayerInfo.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gameState: PropTypes.shape.isRequired,
}

const PlayerInfos = props => {
  const players = [...Array(props.gameState.num_required_players)].map((_, i) => {
    const player = props.gameState.players[(props.gameState.my_position + i) % props.gameState.num_required_players];
    if (player) {
      return (
        <PlayerInfo
          key={`${player.name}PlayerInfoKey`}
          windowWidth={props.windowWidth}
          windowHeight={props.windowHeight}
          relativeToMe={i}
          name={player.name}
          gameState={props.gameState}
        />
      );
    }
  });
  return (
    <Group>
      { players }
    </Group>
  )
};

PlayerInfos.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
};

export default PlayerInfos
