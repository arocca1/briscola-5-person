import React from 'react'
import PropTypes from 'prop-types'
import { Group, Text } from 'react-konva'

const PlayerInfo = props => {
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

PlayerInfo.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  // will be used in the future to handle more games
  numPlayers: PropTypes.number.isRequired,
}

const PlayerInfos = props => {
  const players = [...Array(props.numPlayers)].map((_, i) => {
    const player = props.players[(props.myPosition + i) % props.numPlayers];
    if (player) {
      return (
        <PlayerInfo
          key={`${player.name}PlayerInfoKey`}
          windowWidth={props.windowWidth}
          windowHeight={props.windowHeight}
          relativeToMe={i}
          name={player.name}
          numPlayers={props.numPlayers}
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
  playerId: PropTypes.string.isRequired,
  myPosition: PropTypes.number.isRequired,
  players: PropTypes.shape.isRequired,
  numPlayers: PropTypes.number.isRequired,
};

export default PlayerInfos
