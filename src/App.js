import React from 'react';
import './App.css';

import {COLORS, MOVEMENT_DIRECTION} from './Constants';
import GameBoard from './GameBoard';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <GameBoard
          playerOneColor={COLORS.WHITE}
          playerTwoColor={COLORS.BLACK}
          playerMovementDirection={MOVEMENT_DIRECTION.COUNTERCLOCKWISE}
        />
      </div>
    );
  }
}
