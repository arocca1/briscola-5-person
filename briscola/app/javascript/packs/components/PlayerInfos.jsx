import React from 'react'
import PropTypes from 'prop-types'
import { Group, Text } from 'react-konva'

const PlayerName = props => {
  // me
  let x = props.windowWidth / 2;
  let y = props.windowHeight - props.windowHeight / 20;
  if (props.relativeToMe == 1) {
    x = props.windowWidth - props.windowWidth / 20;
    y = 2 * props.windowHeight / 3;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth - props.windowWidth / 20;
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

}

PlayerBid.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}

const PlayerInfo = props => {
  return (
    <Group>
      <PlayerName
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        name={player.name}
      />
      <PlayerBid
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        handleMakeBid={props.handleMakeBid}
        handlePassBid={props.handlePassBid}
        handleSetPartnerCard={props.handleSetPartnerCard}
      />
    </Group>
  )
}

PlayerInfo.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gameState: PropTypes.shape.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}

const PlayerInfos = props => {
  const players = [...Array(props.gameState.num_players)].map((_, i) => {
    const player = props.gameState.players[(props.gameState.my_position + i) % props.gameState.num_players];
    if (player) {
      return (
        <PlayerInfo
          key={`${player.name}PlayerInfoKey`}
          windowWidth={props.windowWidth}
          windowHeight={props.windowHeight}
          relativeToMe={i}
          name={player.name}
          gameState={props.gameState}
          handleMakeBid={props.handleMakeBid}
          handlePassBid={props.handlePassBid}
          handleSetPartnerCard={props.handleSetPartnerCard}
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
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
};

export default PlayerInfos
