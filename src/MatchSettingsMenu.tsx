import { FunctionComponent, useContext, useState } from "react";
import cx from "classnames";
import Form from "react-bootstrap/Form";
import { ActionsContext } from "./ActionsContext";

export type MatchPointValue = 1 | 3 | 5 | 7 | 9 | 11;

// Note that we pass matchPointsValue, enableDoubling, and their respective
// callbacks from above rather than keep track of the state internally. This is
// because in networked mode, we want to render the match settings as soon as possible
// before the DB load even finishes. When the load does finish, we then wrap the
// MatchSettingsMenu in the NetworkedGameActions context. If the state was tracked
// internally, it would reset at this point which is why we want the parent component
// to track and manage the state.
type MatchSettingsMenuProps = {
  roomCode: string | null;
  matchPointsValue: MatchPointValue;
  enableDoubling: boolean;
  onMatchPointsChanged: (m: MatchPointValue) => void;
  onEnableDoublingChanged: (e: boolean) => void;
};

const MatchSettingsMenu: FunctionComponent<MatchSettingsMenuProps> = ({
  roomCode,
  matchPointsValue,
  enableDoubling,
  onMatchPointsChanged,
  onEnableDoublingChanged,
}) => {
  const actions = useContext(ActionsContext);
  const [showCopyHighlight, setShowCopyHighlight] = useState(false);

  let urlRow = null;
  if (roomCode !== null) {
    const url = "sam-swarr.github.io/backgammon/" + roomCode;
    urlRow = (
      <div className={"Url-copy-row"}>
        <div className={"Url-title-wrapper"} />
        <div className={"Url-form-wrapper"}>
          <div className={"Url-form-text-and-copy"}>
            <div className={"Url-form-text"}>{url}</div>
            <div
              className={cx("Url-form-copy", {
                highlight: showCopyHighlight,
              })}
              onClick={() => {
                navigator.clipboard.writeText(url);
                setShowCopyHighlight(true);
                setTimeout(() => {
                  setShowCopyHighlight(false);
                }, 300);
              }}
            />
          </div>
          <div className={"Url-form-subtext"}>
            Have your friend connect to this address
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"Match-settings-menu-wrapper"}>
      <div className={"Match-settings-title-wrapper"} />
      <div className={"Match-points-settings-row"}>
        <div className={"Play-to-wrapper"} />
        <div className={"Match-points-buttons-wrapper"}>
          <div
            className={cx("Match-points-button", "one", {
              selected: matchPointsValue === 1,
            })}
            onClick={() => onMatchPointsChanged(1)}
          />
          <div
            className={cx("Match-points-button", "three", {
              selected: matchPointsValue === 3,
            })}
            onClick={() => onMatchPointsChanged(3)}
          />
          <div
            className={cx("Match-points-button", "five", {
              selected: matchPointsValue === 5,
            })}
            onClick={() => onMatchPointsChanged(5)}
          />
          <div
            className={cx("Match-points-button", "seven", {
              selected: matchPointsValue === 7,
            })}
            onClick={() => onMatchPointsChanged(7)}
          />
          <div
            className={cx("Match-points-button", "nine", {
              selected: matchPointsValue === 9,
            })}
            onClick={() => onMatchPointsChanged(9)}
          />
          <div
            className={cx("Match-points-button", "eleven", {
              selected: matchPointsValue === 11,
            })}
            onClick={() => onMatchPointsChanged(11)}
          />
        </div>
      </div>
      <div className={"Doubling-cube-settings-row"}>
        <div className={"Doubling-cube-text-wrapper"} />
        <Form className={"Doubling-cube-toggle-form"}>
          <div
            className={cx("Doubling-cube-toggle-off", {
              enabled: !enableDoubling,
            })}
          />
          <Form.Check
            type={"switch"}
            className={"Doubling-cube-toggle"}
            onChange={(e) => onEnableDoublingChanged(e.target.checked)}
            checked={enableDoubling}
          />
          <div
            className={cx("Doubling-cube-toggle-on", {
              enabled: enableDoubling,
            })}
          />
        </Form>
      </div>
      {urlRow}
      <div className={"Start-game-button-row"}>
        <button
          className={"Start-game-button"}
          onClick={() => {
            actions.updateMatchSettings(matchPointsValue, enableDoubling);
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default MatchSettingsMenu;
