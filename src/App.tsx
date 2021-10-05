import React, { FunctionComponent } from 'react';
import './App.css';

import {Color, MovementDirection} from './Types';
import GameBoard from './GameBoard';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  return (
    <div>
      <GameBoard
        playerOneColor={Color.White}
        playerTwoColor={Color.Black}
        playerMovementDirection={MovementDirection.CounterClockwise}
      />
    </div>
  );
}

export default App;
