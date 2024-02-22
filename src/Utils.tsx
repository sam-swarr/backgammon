import { Actions, LocalGameActions } from "./ActionsContext";
import { PlayersData } from "./store/playersSlice";

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
export function isHostClient(players: PlayersData, actions: Actions) {
  return players.isHost || actions instanceof LocalGameActions;
}
