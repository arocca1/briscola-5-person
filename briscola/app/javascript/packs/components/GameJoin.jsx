import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doJoinGame } from '../redux/actions'

class GameJoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerName: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.joinGame(this.props.gameId, this.state.playerName)
  }

  handlePlayerNameChange(event) {
    this.setState({ playerName: event.target.value });
  }

  render() {
    return (
      <div key="GameCreateDiv">
        <form onSubmit={this.handleSubmit}>
          <h2>Join game</h2>
          <div>
            <label>Player name:
              <input type="text" value={this.state.playerName} onChange={this.handlePlayerNameChange} />
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    gameId: ownProps.gameId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    joinGame: (gameId, playerName) => dispatch(doJoinGame(gameId, playerName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameJoin)
