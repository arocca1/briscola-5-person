import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../redux/configureStore'
import Game from './Game'

const store = configureStore()

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('game_id_data');
  let component = <Game />;
  if (node) {
    const data = node.getAttribute('game_id');
    component = <Game gameId={data}/>;
  }

  ReactDOM.render(
    <Provider store={store}>
      { component }
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  );
});
