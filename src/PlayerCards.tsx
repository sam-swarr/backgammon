import { FunctionComponent } from "react";
import PlayerCard, { PlayerCardSide } from "./PlayerCard";

const PlayerCards: FunctionComponent = () => {
  return (
    <div className={"Player-cards-wrapper"}>
      <PlayerCard side={PlayerCardSide.Bottom} />
      <PlayerCard side={PlayerCardSide.Top} />
    </div>
  );
};

export default PlayerCards;
