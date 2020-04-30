import React from 'react'
import PropTypes from 'prop-types'
import { Group, Text, Rect, Label } from 'react-konva'

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
  // me
  let x = props.windowWidth * 3 / 4;
  let y = props.windowHeight * 17 / 20;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 17 / 20;
    y = 2 * props.windowHeight / 3;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 17 / 20;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth * 3 / 20;
    y = props.windowHeight / 3;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth * 3 / 20;
    y = 2 * props.windowHeight / 3;
  } // the else case is me

  const bidKey = `${props.gameState.id}BidKey`;
  const playerBid = props.gameState.player_bids[(props.gameState.my_position + props.relativeToMe) % props.gameState.num_players];
  let bidGroup = null;
  if (props.relativeToMe == 0) {
    // TODO need to figure out how to get inputs to be drawn
    bidGroup = (
      <Group
        key={bidKey}
        x={x}
        y={y}
      >
        <Text text="Bid amount: " />
        <Label onClick={props.handleMakeBid}><Text text="Make Bid"/></Label>
        <Label onClick={props.handlePassBid}><Text text="Pass"/></Label>
      </Group>
    )
  } else {
    let playerText = "No bid yet";
    if (playerBid.passed) {
      playerText = "Passed";
    } else if (playerBid.bid) {
      playerText = `Bid Amount: ${playerBid.bid}`;
    }
    bidGroup = (
      <Group
        key={bidKey}
        x={x}
        y={y}
      >
        <Text text={playerText} />
      </Group>
    )
  }

  return bidGroup;
}

PlayerBid.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
  handleBidChange: PropTypes.func.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
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
        handleBidChange={props.handleBidChange}
        handleMakeBid={props.handleMakeBid}
        handlePassBid={props.handlePassBid}
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
    </Group>
  )
}

PlayerInfo.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gameState: PropTypes.shape.isRequired,
  handleBidChange: PropTypes.func.isRequired,
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
          handleBidChange={props.handleBidChange}
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
  handleBidChange: PropTypes.func.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
};

export default PlayerInfos
