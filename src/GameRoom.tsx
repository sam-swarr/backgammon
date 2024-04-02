import { FunctionComponent } from "react";
import PlayerCards from "./PlayerCards";
import GameBoard from "./GameBoard";
import InformationText from "./InformationText";
import { Player } from "./Types";

type GameRoomProps = {
  playerPerspective: Player;
};

const GameRoom: FunctionComponent<GameRoomProps> = ({
  playerPerspective,
}: GameRoomProps) => {
  return (
    <div className={"Game-area-wrapper"}>
      <PlayerCards />
      <GameBoard playerPerspective={playerPerspective} />
      <InformationText />
    </div>
  );
};

export default GameRoom;
