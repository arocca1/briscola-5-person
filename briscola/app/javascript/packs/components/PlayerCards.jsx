import React from 'react'
import PropTypes from 'prop-types'

const PlayerCards = props => {
  return null;
}

PlayerCards.PropTypes = {
  suitId: PropTypes.string.isRequired,
  rawValue: PropTypes.number.isRequired,
  onCardSelect: PropTypes.func,
}

export default PlayerCards;
