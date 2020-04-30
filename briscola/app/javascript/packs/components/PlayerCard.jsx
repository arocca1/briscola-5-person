import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-konva'

const PlayerCard = props => {
  return null;
}

PlayerCard.PropTypes = {
  suitId: PropTypes.string.isRequired,
  rawValue: PropTypes.number.isRequired,
  onCardSelect: PropTypes.func,
}

export default PlayerCard;
