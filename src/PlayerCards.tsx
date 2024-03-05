import { FunctionComponent } from "react";
import PlayerCard, { PlayerCardSide } from "./PlayerCard";

const PlayerCards: FunctionComponent = () => {
  return (
    <div className={"Player-cards-wrapper"}>
      <PlayerCard side={PlayerCardSide.Left} />
      <PlayerCard side={PlayerCardSide.Right} />
    </div>
  );
};

export default PlayerCards;
