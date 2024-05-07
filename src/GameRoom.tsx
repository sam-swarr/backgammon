import { FunctionComponent } from "react";
import GameBoard from "./GameBoard";
import { Player } from "./Types";
import PlayerCard, { PlayerCardSide } from "./PlayerCard";
import SettingsMenu from "./SettingsMenu";
import GameOverDialog from "./GameOverDialog";

type GameRoomProps = {
  playerPerspective: Player;
};

const GameRoom: FunctionComponent<GameRoomProps> = ({
  playerPerspective,
}: GameRoomProps) => {
  return (
    <div className={"Game-area-wrapper"}>
      <SettingsMenu playerPerspective={playerPerspective} />
      <GameOverDialog playerPerspective={playerPerspective} />
      <PlayerCard
        side={PlayerCardSide.Top}
        playerPerspective={playerPerspective}
      />
      <GameBoard playerPerspective={playerPerspective} />
      <PlayerCard
        side={PlayerCardSide.Bottom}
        playerPerspective={playerPerspective}
      />
    </div>
  );
};

export default GameRoom;
