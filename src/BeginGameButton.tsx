import { FunctionComponent } from "react";

type BeginGameButtonProps = {
  beginGameHandler: Function;
};

const BeginGameButton: FunctionComponent<BeginGameButtonProps> = ({
  beginGameHandler,
}: BeginGameButtonProps) => {
  return (
    <div className={"Begin-game-button-wrapper"}>
      <button
        className={"Begin-game-button"}
        onClick={() => {
          beginGameHandler();
        }}
      >
        Begin Game
      </button>
    </div>
  );
};

export default BeginGameButton;
