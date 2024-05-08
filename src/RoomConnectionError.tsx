import { FunctionComponent } from "react";
import { resetLocalStore } from "./Utils";
import { useAppDispatch } from "./store/hooks";
import { setWipeTransition } from "./store/wipeTransitionSlice";
import { useNavigate } from "react-router-dom";

export enum RoomConnectionErrorType {
  None = "None",
  NotFound = "NotFound",
  TooManyPlayers = "TooManyPlayers",
}

type RoomConnectionErrorProps = {
  type: RoomConnectionErrorType;
  roomCode: string;
};

const RoomConnectionError: FunctionComponent<RoomConnectionErrorProps> = ({
  type,
  roomCode,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let headerText = null;
  let errorText = null;
  if (type === RoomConnectionErrorType.NotFound) {
    headerText = "Room Not Found";
    errorText = "Could not find room with code: ";
  } else {
    headerText = "Room Full";
    errorText = "Two players have already connected to room: ";
  }

  return (
    <div className={"Room-connection-error-wrapper"}>
      <div className={"Room-connection-error-header"}>{headerText}</div>
      <div className={"Room-connection-error-text"}>
        {errorText}
        {<span className={"Room-connection-error-roomcode"}>{roomCode}</span>}
      </div>
      <div className={"Room-connection-error-subtext"}>
        Please double check the code or try creating another room.
      </div>
      <div className={"Room-connection-error-menu-button-wrapper"}>
        <button
          className={"Room-connection-error-menu-button"}
          onClick={() => {
            resetLocalStore(dispatch, true);
            dispatch(setWipeTransition(true));
            navigate("/");
          }}
        >
          Return To Menu
        </button>
      </div>
    </div>
  );
};

export default RoomConnectionError;
