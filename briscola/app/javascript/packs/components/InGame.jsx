import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Stage, Layer, Rect, Image, Text } from 'react-konva'
import PlayerInfos from './PlayerInfos'
import CurrentPlayerBiddingForm from './CurrentPlayerBiddingForm'
import CurrentPlayerSetPartnerCardForm from './CurrentPlayerSetPartnerCardForm'
import CurrentPlayerCardPlayForm from './CurrentPlayerCardPlayForm'
import Spinner from 'react-bootstrap/Spinner'
import { isItMyTurn } from '../util'

import {
  doFetchGameState,
  doMakeBid,
  doPassBid,
  doSetPartnerCard,
  setBid,
  selectCard,
} from '../redux/actions'

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
    this.handleSetPartnerCard = this.handleSetPartnerCard.bind(this);
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
    this.props.handleCardSelect(suitName, suitId, rawValue, cardName);
  }

  handleSetPartnerCard(e) {
    this.props.handleSetPartnerCard(this.props.gameId, this.props.playerId, this.props.suitId, this.props.rawValue);
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
        <div>
          <CurrentPlayerBiddingForm
            gameState={this.props.gameState}
            handleBidChange={this.handleBidChange}
            handleMakeBid={this.handleMakeBid}
            handlePassBid={this.handlePassBid}
          />
          <CurrentPlayerSetPartnerCardForm
            suitName={this.props.suitName}
            cardName={this.props.cardName}
            handleSetPartnerCard={this.handleSetPartnerCard}
          />
          <CurrentPlayerCardPlayForm
            gameState={this.props.gameState}
          />
        </div>
      );
    }
    return (
      <div key="InPageDiv">
        <Stage width={windowWidth} height={windowHeight}>
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
          <Layer key="ScoringLayer">
          </Layer>
          <Layer key="CardsLayer">
          </Layer>
          <Layer key="MiscLayer">
          </Layer>
        </Stage>
        { actionForms }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { activeGameReducer } = state
  const {
    gameState,
    bid,
    suitName,
    suitId,
    rawValue,
    cardName,
  } = activeGameReducer || {
    gameState: {},
    bid: 0,
    suitName: '',
    suitId: '',
    rawValue: 0,
    cardName: '',
  }
  return {
    gameState,
    bid,
    suitName,
    suitId,
    rawValue,
    cardName,
    gameId: ownProps.gameId,
    playerId: ownProps.playerId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameState: (gameId, playerId) => dispatch(doFetchGameState(gameId, playerId)),
    handleBidChange: (bid) => dispatch(setBid(bid)),
    handleMakeBid: (gameId, playerId, bid) => dispatch(doMakeBid(gameId, playerId, bid)),
    handlePassBid: (gameId, playerId) => dispatch(doPassBid(gameId, playerId)),
    handleCardSelect: (suitName, suitId, rawValue, cardName) => dispatch(selectCard(suitName, suitId, rawValue, cardName)),
    handleSetPartnerCard: (gameId, playerId, suitId, rawValue) => dispatch(doSetPartnerCard(gameId, playerId, suitId, rawValue)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InGame)
