import { Actions, LocalGameActions } from "./ActionsContext";
import { getCurrentUser } from "./Firebase";
import { Player } from "./Types";
import { PlayersData, PlayersDataPayload } from "./store/playersSlice";

/**
 * Certain actions or pieces of UI should only be performed or shown to
 * the "host" client. This is a convenience function for determining that.
 * For a networked game, this will be the player who created the lobby.
 * For a local game, there's only one client which is always the host.
 *
 * @param players the `players` slice of the store
 * @param actions the Actions instance returned by useContext(ActionsContext)
 * @returns true if the current client is the host
 */
export function isHostClient(players: PlayersData, actions: Actions): boolean {
  return players.isHost || actions instanceof LocalGameActions;
}

/**
 * Certain actions or pieces of UI should only be performed or shown to
 * the current player's client. This is a convenience function for determining
 * that. For a local game, there's only one client which is always considered
 * the "current player".
 *
 * @param players the `players` slice of the store
 * @param currentPlayer the Player value for the currently acting player
 * @param actions the Actions instance returned by useContext(ActionsContext)
 * @returns true if the current client is the currently active player
 */
export function isCurrentPlayer(
  players: PlayersData,
  currentPlayer: Player,
  actions: Actions
): boolean {
  if (actions instanceof LocalGameActions) {
    return true;
  }

  if (players.playerOne == null || players.playerTwo == null) {
    throw new Error("Player data unexpectedly null.");
  }

  let uid = getCurrentUser().uid;
  return (
    (players.playerOne.uid === uid && currentPlayer === Player.One) ||
    (players.playerTwo.uid === uid && currentPlayer === Player.Two)
  );
}

/**
 * @param players the `players` slice of the store
 * @returns the Player value corresponding to the current client
 */
export function getClientPlayer(players: PlayersDataPayload): Player {
  if (players.playerOne == null || players.playerTwo == null) {
    throw new Error("Player data unexpectedly null.");
  }

  let uid = getCurrentUser().uid;
  if (players.playerOne.uid === uid) {
    return Player.One;
  } else if (players.playerTwo.uid === uid) {
    return Player.Two;
  }
  throw new Error("Unable to find player uid in player data.");
}
