import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-konva'
import useImage from 'use-image';

class PlayerCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleCardSelect = this.handleCardSelect.bind(this);
  }

  handleCardSelect(e) {
    this.props.handleCardSelect(this.props.suitName, this.props.suitId, this.props.rawValue, this.props.cardName);
  }

  render() {
    const [image] = useImage(`/${this.props.suitName}_${this.props.cardName}.png`);
    return (
      <Image
        image={image}
        x={this.props.x}
        y={this.props.y}
        width={60}
        height={60}
        onClick={this.handleCardSelect}
      />
    );
  }
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
