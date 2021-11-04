import { FunctionComponent } from 'react';
import './App.css';

import { GameState } from './store/gameStateSlice';
import { useAppSelector } from './store/hooks';
import {Color, MovementDirection} from './Types';
import GameBoard from './GameBoard';
import MainMenu from './MainMenu';
import SettingsMenuButton from './SettingsMenuButton';
import SettingsMenu from './SettingsMenu';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  const [
    currentPlayer,
    gameState,
  ] = useAppSelector((state) => [
    state.currentPlayer,
    state.gameState,
  ]);

  let contents = null;
  if (gameState === GameState.NotStarted) {
    contents = <MainMenu />;
  } else {
    contents = (
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

  return (
    <div className={"App-wrapper"}>
      <SettingsMenuButton />
      <SettingsMenu />
      {contents}
    </div>
  );
}

export default App;
