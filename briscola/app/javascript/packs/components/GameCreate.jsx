import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchGameTypes, createNewGame } from '../redux/actions'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'

class GameCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {gameName: '', playerName: '', gameToCreate: '1'};

    this.handleGameTypeChange = this.handleGameTypeChange.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.loadGameTypes();
  }

  handleGameTypeChange(event) {
    this.setState({gameToCreate: event});
  }

  handleGameNameChange(event) {
    this.setState({gameName: event.target.value});
  }

  handlePlayerNameChange(event) {
    this.setState({playerName: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleGameCreate(this.state.gameName, this.state.playerName, this.state.gameToCreate);
  }

  render() {
    if (this.props.loadingGameTypes) {
      return <Spinner animation="border" />;
    }

    const dropdownItems = this.props.gameTypes.map(gameType => {
      return <Dropdown.Item key={gameType.name} eventKey={gameType.id}>{ gameType.name }</Dropdown.Item>
    })
    return (
      <div key="GameCreateDiv">
        <form onSubmit={this.handleSubmit}>
          <h2>Create game</h2>
          <Dropdown onSelect={this.handleGameTypeChange}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Game Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
              { dropdownItems }
            </Dropdown.Menu>
          </Dropdown>
          <div>
            <label>Game name:
              <input type="text" value={this.state.gameName} onChange={this.handleGameNameChange} />
            </label>
          </div>
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

GameCreate.defaultProps = {
  loadingGameTypes: true,
}

GameCreate.propTypes = {
  handleGameCreate: PropTypes.func.isRequired,
  gameTypes: PropTypes.array,
  loadingGameTypes: PropTypes.bool.isRequired,
  loadGameTypes: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  const { gameTypesReducer } = state
  const { gameTypes, loadingGameTypes } = gameTypesReducer || { gameTypes: [], loadingGameTypes: true }
  return {
    gameTypes,
    loadingGameTypes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadGameTypes: () => dispatch(fetchGameTypes()),
    handleGameCreate: (gameName, playerName, gameToCreate) => dispatch(createNewGame(gameName, playerName, gameToCreate)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameCreate)
