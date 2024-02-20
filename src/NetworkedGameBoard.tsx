import { FunctionComponent } from "react";

import { useLoaderData } from "react-router-dom";
import InformationText from "./InformationText";
import { Color } from "./Types";
import { useAppSelector } from "./store/hooks";
import GameBoard from "./GameBoard";

type NetworkedGameBoardProps = {};

type LoaderData = {
  roomCode: string;
};

export function loader({ params }: any): LoaderData {
  return { roomCode: params.roomCode };
}

const NetworkedGameBoard: FunctionComponent<NetworkedGameBoardProps> = () => {
  const { roomCode } = useLoaderData() as LoaderData;
  const [currentPlayer, settings] = useAppSelector((state) => [
    state.currentPlayer,
    state.settings,
  ]);

  return (
    <div className={"Game-area-wrapper"}>
      <GameBoard
        currentPlayer={currentPlayer}
        playerOneColor={settings.playerOneColor}
        playerTwoColor={
          settings.playerOneColor === Color.White ? Color.Black : Color.White
        }
        playerMovementDirection={settings.movementDirection}
      />
      <InformationText />
    </div>
  );
};

export default NetworkedGameBoard;
