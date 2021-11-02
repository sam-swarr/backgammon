import { FunctionComponent } from 'react';

import { GameState, setState } from './store/gameStateSlice';
import { useAppDispatch } from './store/hooks';

type MainMenuProps = {};

const MainMenu: FunctionComponent<MainMenuProps> = () => {

  const dispatch = useAppDispatch();

  return (
    <div className={"Main-menu-wrapper"}>
      <div className={"Title-wrapper"}>
        Backgammon
      </div>
      <div className={"Menu-button-wrapper"}>
        <button
          className={"Local-multiplayer-button"}
          onClick={() => { dispatch(setState({ newState: GameState.PlayerMoving })) }}>
          Local Multiplayer
        </button>
        <button
          className={"Online-multiplayer-button"}
          onClick={() => { console.log("CLICK"); }}>
          Online Multiplayer
        </button>
      </div>
    </div>
  );
}

export default MainMenu;
