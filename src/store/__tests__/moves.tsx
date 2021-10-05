import { getMoveIfValid } from '../moves'; 
import { STARTING_BOARD_STATE } from '../../Constants'
import { Player } from '../../Types'

test('getMoveIfValid returns null if currentPlayer does not occupy fromPoint', () => {
  expect(getMoveIfValid(
    STARTING_BOARD_STATE,
    0, // fromPoint
    1, // dieValue
    Player.One
  )).toBeNull();
});
