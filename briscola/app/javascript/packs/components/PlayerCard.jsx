import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-konva'
import useImage from 'use-image';

const PlayerCard = props => {
  const [image] = useImage(`/${props.suitName}_${props.cardName}.png`);
  return (
    <Image
      image={image}
      x={props.x}
      y={props.y}
      width={60}
      height={60}
    />
  );
}

PlayerCard.PropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  suitName: PropTypes.string.isRequired,
  suitId: PropTypes.string.isRequired,
  rawValue: PropTypes.number.isRequired,
  cardName: PropTypes.string.isRequired,
  handleCardSelect: PropTypes.func,
}

export default PlayerCard;
