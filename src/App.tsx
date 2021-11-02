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
    settings,
  ] = useAppSelector((state) => [
    state.currentPlayer,
    state.gameState,
    state.settings,
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

  let settingsMenu = null;
  if (settings.showSettingsMenu) {
    settingsMenu = <SettingsMenu />;
  }

  return (
    <div className={"App-wrapper"}>
      <SettingsMenuButton />
      {settingsMenu}
      {contents}
    </div>
  );
}

export default App;
