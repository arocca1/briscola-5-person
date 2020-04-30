import React from 'react'
import PropTypes from 'prop-types'

export default class CurrentPlayerSetPartnerCardForm extends React.Component {
  render() {
    return <div></div>
  }
}

CurrentPlayerSetPartnerCardForm.PropTypes = {
  gameState: PropTypes.shape.isRequired,
  handleSetPartnerCard: PropTypes.func.isRequired,
}
