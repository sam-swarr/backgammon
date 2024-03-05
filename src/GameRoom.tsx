import { FunctionComponent } from "react";
import PlayerCards from "./PlayerCards";
import GameBoard from "./GameBoard";
import InformationText from "./InformationText";

const GameRoom: FunctionComponent = () => {
  return (
    <div className={"Game-area-wrapper"}>
      <PlayerCards />
      <GameBoard />
      <InformationText />
    </div>
  );
};

export default GameRoom;
