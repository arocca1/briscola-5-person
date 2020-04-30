import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const CurrentPlayerCardPlayForm = props => {
  // bidding has to be done, a partner card has to be set, and a card has to be selected
  if (!props.gameState.bidding_done || !props.gameState.partner_card || !props.suitName || !props.cardName) {
    return null;
  }

  return (
    <div>
      <h4>Playing card</h4>
      <div>
        <label>Play {`${props.cardName} di ${props.suitName}`}?</label>
        <Button variant="primary" onClick={props.handleSetPartnerCard}>Do it</Button>
      </div>
    </div>
  );
}

CurrentPlayerCardPlayForm.PropTypes = {
  gameState: PropTypes.shape.isRequired,
  suitName: PropTypes.string.isRequired,
  cardName: PropTypes.string.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}

export default CurrentPlayerCardPlayForm
