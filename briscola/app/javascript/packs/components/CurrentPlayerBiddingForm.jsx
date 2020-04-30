import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const CurrentPlayerBiddingForm = props => {
  if (props.gameState.bidding_done) {
    return null;
  }
  const maxBidText = props.gameState.max_bid ? `Current max bid: ${props.gameState.max_bid}` : '';

  return (
    <div>
      <h4>Bidding</h4>
      <div>{ maxBidText }</div>
      <div>
        <label>Your next bid:
          <input type="number" onChange={props.handleBidChange} />
        </label>
        <Button variant="primary" onClick={props.handleMakeBid}>Make Bid</Button>
      </div>
      <Button variant="warning" onClick={props.handlePassBid}>Pass</Button>
    </div>
  );
}

CurrentPlayerBiddingForm.PropTypes = {
  gameState: PropTypes.shape.isRequired,
  handleBidChange: PropTypes.func.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
}

export default CurrentPlayerBiddingForm;
