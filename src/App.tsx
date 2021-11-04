import { FunctionComponent } from 'react';
import './App.css';

import { GameState } from './store/gameStateSlice';
import { useAppSelector } from './store/hooks';
import { Color } from './Types';
import GameBoard from './GameBoard';
import MainMenu from './MainMenu';
import SettingsMenuButton from './SettingsMenuButton';
import SettingsMenu from './SettingsMenu';
import GameOverDialog from './GameOverDialog';

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
          playerOneColor={settings.playerOneColor}
          playerTwoColor={settings.playerOneColor === Color.White ? Color.Black : Color.White}
          playerMovementDirection={settings.movementDirection}
        />
      </div>
    );
  }

  return (
    <div className={"App-wrapper"}>
      <SettingsMenuButton />
      <SettingsMenu />
      <GameOverDialog />
      {contents}
    </div>
  );
}

export default App;
