import React from 'react';
import logo from './logo.svg';
import './App.css';

import {COLORS, MOVEMENT_DIRECTION, STARTING_BOARD_STATE} from './Constants';
import GameBoard from './GameBoard';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <GameBoard
          gameBoardState={STARTING_BOARD_STATE}
          playerOneColor={COLORS.WHITE}
          playerTwoColor={COLORS.BLACK}
          playerMovementDirection={MOVEMENT_DIRECTION.COUNTERCLOCKWISE}
        />
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Backgammon
      //     </p>
      //   </header>
      // </div>
    );
  }
}
