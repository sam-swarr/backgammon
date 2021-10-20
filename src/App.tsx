import React, { FunctionComponent } from 'react';
import './App.css';

import { useAppSelector } from './store/hooks'
import {Color, MovementDirection} from './Types';
import GameBoard from './GameBoard';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const currentPlayer = useAppSelector((state) => state.currentPlayer);

  return (
    <div>
      <GameBoard
        currentPlayer={currentPlayer}
        playerOneColor={Color.White}
        playerTwoColor={Color.Black}
        playerMovementDirection={MovementDirection.CounterClockwise}
      />
    </div>
  );
}

export default App;
