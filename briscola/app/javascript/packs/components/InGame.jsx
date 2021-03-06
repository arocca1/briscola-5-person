import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Stage, Layer, Rect, Image, Text, Group } from 'react-konva'
import PlayerInfos from './PlayerInfos'
import PlayerCard from './PlayerCard'
import CardsInPlay from './CardsInPlay'
import CurrentPlayerBiddingForm from './CurrentPlayerBiddingForm'
import CurrentPlayerSetPartnerCardForm from './CurrentPlayerSetPartnerCardForm'
import CurrentPlayerCardPlayForm from './CurrentPlayerCardPlayForm'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { isItMyTurn, baseUrl } from '../util'

import {
  doFetchGameState,
  doMakeBid,
  doPassBid,
  doSetPartnerCard,
  setBid,
  selectCard,
  setPartnerSuit,
  setPartnerCardRawValue,
  doPlayCard,
  doCreateAndJoinNewGame,
} from '../redux/actions'

const FinalScore = props => {
  if (!props.gameState.game_complete) {
    return null;
  }

  if (props.gameState.requires_bidding) {
    // there is no standard JavaScript partition function???
    const [biddingTeamNames, nonBiddingTeamNames] = props.gameState.players.reduce((acc, player) => {
      if (player.on_bidding_team) {
        return [acc[0].concat(player.name), acc[1]];
      } else {
        return [acc[0], acc[1].concat(player.name)];
      }
      return fn(el, i, arr) ? acc[0].push(el) : acc[1].push(el), acc;
    }, [[],[]]);
    const biddingTeamScore = props.gameState.bidding_team_score;
    let result;
    if (biddingTeamScore === props.gameState.max_bid) {
      result = "It's a tie!";
    } else if (biddingTeamScore > props.gameState.max_bid) {
      result = "Bidding team won!";
    } else {
      result = "Bidding team lost!";
    }

    const resultsX = props.windowWidth * 2 / 5;
    const resultsStartingY = props.windowHeight * 7 / 30;
    const yIncrement = 20;
    return (
      <Group>
        <Text x={resultsX} y={resultsStartingY} text="Final Results" />
        <Text x={resultsX} y={resultsStartingY + yIncrement} text={ `Max bid of ${props.gameState.max_bid} made by ${props.gameState.max_bidder_name}` } />
        <Text x={resultsX} y={resultsStartingY + yIncrement * 2} text={ `Score for partner team of ${biddingTeamNames.join(", ")}: ${biddingTeamScore}` } />
        <Text x={resultsX} y={resultsStartingY + yIncrement * 3} text={ `Score for non-partner team of ${nonBiddingTeamNames.join(", ")}: ${props.gameState.other_team_score}` } />
        <Text x={resultsX} y={resultsStartingY + yIncrement * 4} text={ result } />
      </Group>
    );
  }
}

FinalScore.PropTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  gameState: PropTypes.shape.isRequired,
}

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
  constructor(props) {
    super(props);

    this.handleBidChange = this.handleBidChange.bind(this);
    this.handleMakeBid = this.handleMakeBid.bind(this);
    this.handlePassBid = this.handlePassBid.bind(this);
    this.handleCardSelect = this.handleCardSelect.bind(this);
    this.handleSetPartnerSuit = this.handleSetPartnerSuit.bind(this);
    this.handleSetPartnerCardRawValue = this.handleSetPartnerCardRawValue.bind(this);
    this.handleSetPartnerCard = this.handleSetPartnerCard.bind(this);
    this.handlePlayCard = this.handlePlayCard.bind(this);
    this.handleCreateAndJoinNewGame = this.handleCreateAndJoinNewGame.bind(this);
  }

  handleBidChange(e) {
    this.props.handleBidChange(e.target.value);
  }

  handleMakeBid(e) {
    this.props.handleMakeBid(this.props.gameId, this.props.playerId, this.props.bid);
  }

  handlePassBid(e) {
    this.props.handlePassBid(this.props.gameId, this.props.playerId);
  }

  handleCardSelect(suitName, suitId, rawValue, cardName) {
    return (e) => this.props.handleCardSelect(suitName, suitId, rawValue, cardName);
  }

  handleSetPartnerSuit(e) {
    this.props.handleSetPartnerSuit(e);
  }

  handleSetPartnerCardRawValue(e) {
    this.props.handleSetPartnerCardRawValue(e);
  }

  handleSetPartnerCard(e) {
    this.props.handleSetPartnerCard(this.props.gameId, this.props.playerId, this.props.partnerCardSuitId, this.props.partnerCardRawValue);
  }

  handlePlayCard(e) {
    this.props.handlePlayCard(this.props.gameId, this.props.playerId, this.props.suitId, this.props.rawValue);
  }

  handleCreateAndJoinNewGame(e) {
    this.props.handleCreateAndJoinNewGame(this.props.gameId, this.props.playerId);
  }

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
    if (!this.props.gameState) {
      return <Spinner animation="border" />;
    }
    // leave room for actions
    const windowWidth = window.innerWidth * 0.9;
    const windowHeight = window.innerHeight * 0.9;
    let text;
    if (!this.props.gameState.all_players_joined) {
      text = 'Waiting for more players to join...';
    } else if (this.props.gameState.requires_bidding && !this.props.gameState.bidding_done) {
      text = "Let's do some bidding!";
    }
    let message;
    if (text) {
      message = <Text key='MainMessage' x={windowWidth / 4} y={windowHeight / 2} text={text} />;
    }
    let actionForms;
    if (isItMyTurn(this.props.gameState)) {
      actionForms = (
        <div key="ActionFormsKey">
          <CurrentPlayerBiddingForm
            gameState={this.props.gameState}
            handleBidChange={this.handleBidChange}
            handleMakeBid={this.handleMakeBid}
            handlePassBid={this.handlePassBid}
          />
          <CurrentPlayerSetPartnerCardForm
            gameState={this.props.gameState}
            partnerCardSuitId={this.props.partnerCardSuitId}
            partnerCardRawValue={this.props.partnerCardRawValue}
            handleSetPartnerSuit={this.handleSetPartnerSuit}
            handleSetPartnerCardRawValue={this.handleSetPartnerCardRawValue}
            handleSetPartnerCard={this.handleSetPartnerCard}
          />
          <CurrentPlayerCardPlayForm
            gameState={this.props.gameState}
            suitName={this.props.suitName}
            cardName={this.props.cardName}
            handlePlayCard={this.handlePlayCard}
          />
        </div>
      );
    }
    let currentHandScoreGroup;
    if (this.props.gameState.current_leader_name) {
      const wonHand = this.props.gameState.cards_in_current_hand.length === this.props.gameState.num_required_players;
      currentHandScoreGroup = (
        <Group>
          <Text x={windowWidth * 13/20} y={5} text="Current hand score" />
          <Text x={windowWidth * 13/20} y={25} text={ `${this.props.gameState.current_hand_score}, ${wonHand ? "won" : "led"} by ${this.props.gameState.current_leader_name}` } />
        </Group>
      )
    }
    let maxBidderGroup;
    if (this.props.gameState.max_bid && this.props.gameState.max_bidder_name) {
      maxBidderGroup = (
        <Group>
          <Text x={windowWidth * 3/4} y={5} text="Maximum bid" />
          <Text x={windowWidth * 3/4} y={25} text={ `${this.props.gameState.max_bid} by ${this.props.gameState.max_bidder_name}` } />
        </Group>
      )
    }
    let partnerCardGroup;
    if (this.props.gameState.partner_card) {
      partnerCardGroup = (
        <Group>
          <Text x={windowWidth * 17/20} y={5} text="Partner Card" />
          <PlayerCard
            key="PartnerCardKey"
            x={windowWidth * 17/20}
            y={25}
            suitName={this.props.gameState.partner_card.suit_name}
            cardName={this.props.gameState.partner_card.card_name}
            suitId={this.props.gameState.partner_card.suit_id}
            rawValue={this.props.gameState.partner_card.raw_value}
          />
        </Group>
      );
    }
    let createNewGame;
    // we're at the end of the game
    if (this.props.gameState.my_partners) {
      createNewGame = <Button variant="primary" onClick={this.handleCreateAndJoinNewGame}>Create new game with same players?</Button>;
    }
    return (
      <div key="InPageDiv">
        <Stage width={windowWidth} height={windowHeight}>
          <Layer key="MiscLayer">
            <Group>
              <Text x={5} y={5} text="Send this link to others so that they can join" />
              <Text x={5} y={25} text={ `${baseUrl()}/games/${this.props.gameId}` } />
            </Group>
            { currentHandScoreGroup }
            { maxBidderGroup }
            { partnerCardGroup }
          </Layer>
          <Layer key="TableLayer">
            <TableRect windowWidth={windowWidth} windowHeight={windowHeight} />
            { message }
          </Layer>
          <Layer key="PlayerLayer">
            <PlayerInfos
              windowWidth={windowWidth}
              windowHeight={windowHeight}
              gameState={this.props.gameState}
              handleCardSelect={this.handleCardSelect}
            />
          </Layer>
          <Layer key="PlayedCardsLayer">
            <CardsInPlay
              windowWidth={windowWidth}
              windowHeight={windowHeight}
              gameState={this.props.gameState}
            />
          </Layer>
          <Layer key="ScoringLayer">
            <FinalScore
              windowWidth={windowWidth}
              windowHeight={windowHeight}
              gameState={this.props.gameState}
            />
          </Layer>
        </Stage>
        { actionForms }
        { createNewGame }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { activeGameReducer } = state
  const {
    gameId,
    playerId,
    gameState,
    bid,
    suitName,
    suitId,
    rawValue,
    cardName,
    partnerCardSuitId,
    partnerCardRawValue,
  } = activeGameReducer || {
    gameState: {},
    bid: 0,
    suitName: '',
    suitId: '',
    rawValue: 0,
    cardName: '',
    partnerCardSuitId: '',
    partnerCardRawValue: '',
  }
  return {
    gameId,
    playerId,
    gameState,
    bid,
    suitName,
    suitId,
    rawValue,
    cardName,
    partnerCardSuitId,
    partnerCardRawValue,
    gameId: gameId || ownProps.gameId,
    playerId: playerId || ownProps.playerId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameState: (gameId, playerId) => dispatch(doFetchGameState(gameId, playerId)),
    handleBidChange: (bid) => dispatch(setBid(bid)),
    handleMakeBid: (gameId, playerId, bid) => dispatch(doMakeBid(gameId, playerId, bid)),
    handlePassBid: (gameId, playerId) => dispatch(doPassBid(gameId, playerId)),
    handleCardSelect: (suitName, suitId, rawValue, cardName) => dispatch(selectCard(suitName, suitId, rawValue, cardName)),
    handleSetPartnerSuit: (suitId) => dispatch(setPartnerSuit(suitId)),
    handleSetPartnerCardRawValue: (rawValue) => dispatch(setPartnerCardRawValue(rawValue)),
    handleSetPartnerCard: (gameId, playerId, suitId, rawValue) => dispatch(doSetPartnerCard(gameId, playerId, suitId, rawValue)),
    handlePlayCard: (gameId, playerId, suitId, rawValue) => dispatch(doPlayCard(gameId, playerId, suitId, rawValue)),
    handleCreateAndJoinNewGame: (gameId, playerId) => dispatch(doCreateAndJoinNewGame(gameId, playerId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InGame)
