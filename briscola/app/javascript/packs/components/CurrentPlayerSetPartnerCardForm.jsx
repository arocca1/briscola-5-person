import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const CurrentPlayerSetPartnerCardForm = props => {
  if (!props.gameState.bidding_done || props.gameState.partner_card || !props.gameState.suits || !props.gameState.raw_values) {
    return null;
  }

  const suitValues = props.gameState.suits.map(suit => {
    return <Dropdown.Item key={`${suit.name}Key`} eventKey={suit.id}>{ suit.name }</Dropdown.Item>
  })
  const suitValue = props.gameState.suits.find(elem => elem.id == props.partnerCardSuitId);
  const suitDropdown = (
    <DropdownButton
      key="SuitDropdownKey"
      style={{ display: 'inline-block' }}
      variant="secondary"
      onSelect={props.handleSetPartnerSuit}
      title={`${suitValue && suitValue.name || "Suit"}`}
    >
      { suitValues }
    </DropdownButton>
  );

  const rawValues = props.gameState.raw_values.map(rawValue => {
    return <Dropdown.Item key={`${rawValue.name}Key`} eventKey={rawValue.raw_value}>{ rawValue.name }</Dropdown.Item>
  })
  const partnerCardRawValue = props.gameState.raw_values.find(elem => elem.raw_value == props.partnerCardRawValue);
  const rawValueDropdown = (
    <DropdownButton
      key="RawValueDropdownKey"
      style={{ display: 'inline-block' }}
      variant="secondary"
      onSelect={props.handleSetPartnerCardRawValue}
      title={`${partnerCardRawValue && partnerCardRawValue.name || "Value"}`}
    >
      { rawValues }
    </DropdownButton>
  );

  return (
    <div>
      <h4>Partner Card</h4>
      <div>Set {rawValueDropdown} di {suitDropdown} to partner card?</div>
      <Button variant="primary" onClick={props.handleSetPartnerCard}>Do It</Button>
    </div>
  );
}

CurrentPlayerSetPartnerCardForm.PropTypes = {
  gameState: PropTypes.shape.isRequired,
  partnerCardSuitId: PropTypes.string,
  partnerCardRawValue: PropTypes.string,
  handleSetPartnerSuit: PropTypes.func.isRequired,
  handleSetPartnerCardRawValue: PropTypes.func.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}

export default CurrentPlayerSetPartnerCardForm
