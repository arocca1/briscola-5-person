import React from 'react'
import PropTypes from 'prop-types'
import { Group, Text, Circle } from 'react-konva'
import { isItPlayerTurn } from '../util'
import PlayerCard from './PlayerCard'

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
  let y = props.windowHeight * 9 / 10;
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
  let x = props.windowWidth * 9 / 20;
  let y = props.windowHeight * 9 / 10;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 19 / 20;
    y = props.windowHeight * 17 / 30;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 19 / 20;
    y = props.windowHeight * 7 / 30;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth / 20;
    y = props.windowHeight * 7 / 30;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth / 20;
    y = props.windowHeight * 17 / 30;
  } // the else case is me

  if (isItPlayerTurn(props.gameState, props.relativeToMe)) {
    return (
      <Circle
        x={x}
        y={y}
        fill="#89b717"
        radius={20}
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

const PlayerCards = props => {
  let y = props.windowHeight * 3 / 4;
  let startX = props.windowWidth / 2;
  const numCards = props.gameState.my_cards.length;
  if (numCards === 8 || numCards === 7) {
    startX = props.windowWidth * 3 / 10;
  } else if (numCards === 6 || numCards === 5) {
    startX = props.windowWidth * 7 / 20;
  } else if (numCards === 4 || numCards === 3) {
    startX = props.windowWidth * 2 / 5;
  }
  const cards = props.gameState.my_cards.map((card, i) => {
    return (
      <PlayerCard
        key={`${card.card_name}${card.suit_name}PlayerCardKey`}
        x={startX + i * 70}
        y={y}
        suitName={card.suit_name}
        cardName={card.card_name}
        suitId={card.suit_id}
        rawValue={card.raw_value}
        handleCardSelect={props.handleCardSelect}
      />
    );
  });
  return <Group>{ cards }</Group>;
}

PlayerCards.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  handleCardSelect: PropTypes.func.isRequired,
  gameState: PropTypes.shape.isRequired,
}

const PlayerInfo = props => {
  let playerBid;
  let playerTurn;
  let playerCards;
  if (props.gameState.all_players_joined) {
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

    playerTurn = (
      <PlayerTurn
        key={`${props.name}TurnKey`}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        relativeToMe={props.relativeToMe}
        gameState={props.gameState}
      />
    )

    playerCards = (
      <PlayerCards
        key={`${props.name}CardsKey`}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        handleCardSelect={props.handleCardSelect}
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
      { playerCards }
    </Group>
  )
}

PlayerInfo.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gameState: PropTypes.shape.isRequired,
  handleCardSelect: PropTypes.func.isRequired,
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
          handleCardSelect={props.handleCardSelect}
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
  handleCardSelect: PropTypes.func.isRequired,
};

export default PlayerInfos
