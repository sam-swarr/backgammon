import { FunctionComponent } from 'react';
import './App.css';

import { GameState } from './store/gameStateSlice';
import { useAppSelector } from './store/hooks';
import {Color, MovementDirection} from './Types';
import GameBoard from './GameBoard';
import MainMenu from './MainMenu';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const [
    currentPlayer,
    gameState,
  ] = useAppSelector((state) => [
    state.currentPlayer,
    state.gameState,
  ]);

  if (gameState === GameState.NotStarted) {
    return <MainMenu />;
  } else {
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
}

export default App;
