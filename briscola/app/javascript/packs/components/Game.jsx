import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Game = props => {
  return <div>Hello   fffffff {props.name}!</div>;
}

Game.defaultProps = {
  loading: true,
}

const mapStateToProps = state => {
  return {
    loading: true,
    gameTypes: [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

const VisibleGame = connect(mapStateToProps, mapDispatchToProps)(Game)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Game />,
    document.body.appendChild(document.createElement('div')),
  )
})
