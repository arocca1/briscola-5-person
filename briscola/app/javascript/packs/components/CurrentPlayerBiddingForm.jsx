import React from 'react'
import PropTypes from 'prop-types'

export default class CurrentPlayerBiddingForm extends React.Component {
  render() {
    return <div></div>;
  }
}

CurrentPlayerBiddingForm.PropTypes = {
  gameState: PropTypes.shape.isRequired,
  handleBidChange: PropTypes.func.isRequired,
  handleMakeBid: PropTypes.func.isRequired,
  handlePassBid: PropTypes.func.isRequired,
}
