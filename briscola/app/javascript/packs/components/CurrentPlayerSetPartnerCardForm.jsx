import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const CurrentPlayerSetPartnerCardForm = props => {
  return (
    <div>
      <h4>Setting partner card</h4>
      <div>
        <label>Set partner card to {`${props.cardName} di ${props.suitName}`}?</label>
        <Button variant="primary" onClick={props.handleSetPartnerCard}>Do it</Button>
      </div>
    </div>
  );
}

CurrentPlayerSetPartnerCardForm.PropTypes = {
  suitName: PropTypes.string.isRequired,
  cardName: PropTypes.string.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}
