import { FunctionComponent, useState } from "react";
import cx from "classnames";
import Form from "react-bootstrap/Form";

const MatchSettingsMenu: FunctionComponent = () => {
  const [matchPointsValue, setMatchPointsValue] = useState(5);
  const [enableDoubling, setEnableDoubling] = useState(true);

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
            onClick={() => setMatchPointsValue(1)}
          />
          <div
            className={cx("Match-points-button", "three", {
              selected: matchPointsValue === 3,
            })}
            onClick={() => setMatchPointsValue(3)}
          />
          <div
            className={cx("Match-points-button", "five", {
              selected: matchPointsValue === 5,
            })}
            onClick={() => setMatchPointsValue(5)}
          />
          <div
            className={cx("Match-points-button", "seven", {
              selected: matchPointsValue === 7,
            })}
            onClick={() => setMatchPointsValue(7)}
          />
          <div
            className={cx("Match-points-button", "nine", {
              selected: matchPointsValue === 9,
            })}
            onClick={() => setMatchPointsValue(9)}
          />
          <div
            className={cx("Match-points-button", "eleven", {
              selected: matchPointsValue === 11,
            })}
            onClick={() => setMatchPointsValue(11)}
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
            onChange={(e) => setEnableDoubling(e.target.checked)}
            checked={enableDoubling}
          />
          <div
            className={cx("Doubling-cube-toggle-on", {
              enabled: enableDoubling,
            })}
          />
        </Form>
      </div>
    </div>
  );
};

export default MatchSettingsMenu;
