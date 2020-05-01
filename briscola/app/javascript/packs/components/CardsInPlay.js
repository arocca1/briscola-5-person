import React from 'react'
import PropTypes from 'prop-types'
import { Group, Star } from 'react-konva'
import PlayerCard from './PlayerCard'

const PlayedCard = props => {
  // me
  let x = props.windowWidth * 9 / 20;
  let y = props.windowHeight * 3 / 5;
  let starX = props.windowWidth * 11 / 20;
  if (props.relativeToMe == 1) {
    x = props.windowWidth * 3 / 4;
    y = props.windowHeight * 19 / 30;
    starX = props.windowWidth * 9 / 10;
  } else if (props.relativeToMe == 2) {
    x = props.windowWidth * 3 / 4;
    y = props.windowHeight * 7 / 30;
    starX = props.windowWidth * 9 / 10;
  } else if (props.relativeToMe == 3) {
    x = props.windowWidth / 5;
    y = props.windowHeight * 7 / 30;
    starX = props.windowWidth * 3 / 10;
  } else if (props.relativeToMe == 4) {
    x = props.windowWidth / 5;
    y = props.windowHeight * 19 / 30;
    starX = props.windowWidth * 3 / 10;
  } // the else case is me

  let star;
  if (props.isWinningCard) {
    star = (
      <Star
        x={starX}
        y={y}
        fill="#2FD3F0"
        numPoints={5}
        innerRadius={10}
        outerRadius={20}
      />
    );
  }

  return (
    <Group>
      <PlayerCard
        x={x}
        y={y}
        suitName={props.suitName}
        cardName={props.cardName}
        suitId={props.suitId}
        rawValue={props.rawValue}
      />
      { star }
    </Group>
  )
}

PlayedCard.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
  relativeToMe: PropTypes.number.isRequired,
  suitName: PropTypes.string.isRequired,
  suitId: PropTypes.string.isRequired,
  rawValue: PropTypes.number.isRequired,
  cardName: PropTypes.string.isRequired,
  isWinningCard: PropTypes.bool.isRequired,
};

const computeDistanceRelativeToMe = (myIdx, playerIdx, totalNumPlayers) => {
  if (myIdx == playerIdx) {
    return 0;
  } else if (playerIdx > myIdx) {
    return playerIdx - myIdx;
  } else {
    return totalNumPlayers - myIdx + playerIdx;
  }
}

const CardsInPlay = props => {
  if (!props.gameState.cards_in_current_hand || !props.gameState.players) {
    return null;
  }

  const myIdx = props.gameState.players.findIndex(player => player.id === props.gameState.id);
  const cards = props.gameState.cards_in_current_hand.map(card => {
    const playerIdx = props.gameState.players.findIndex(player => player.id === card.player_id);
    const relativeToMe = computeDistanceRelativeToMe(myIdx, playerIdx, props.gameState.num_required_players);
    return (
      <PlayedCard
        key={`${card.player_id}PlayedCardKey`}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        gameState={props.gameState}
        relativeToMe={relativeToMe}
        suitName={card.suit_name}
        cardName={card.card_name}
        suitId={card.suit_id}
        rawValue={card.raw_value}
        isWinningCard={card.player_id === props.gameState.current_leader}
      />
    );
  })

  return (
    <Group>
      { cards }
    </Group>
  )
}

CardsInPlay.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
};

export default CardsInPlay
