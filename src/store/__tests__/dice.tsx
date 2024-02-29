import { HitStatus, Player } from "../../Types";
import { getAvailableDice } from "../dice";

test("getAvailableDice works for doubles", () => {
  const dice = [2, 2, 2, 2];
  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([2, 2, 2]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 4,
        to: 6,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([2, 2]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 4,
        to: 6,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 6,
        to: 8,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([2]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 4,
        to: 6,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 6,
        to: 8,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 8,
        to: 10,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([]);
});

test("getAvailableDice works for non-doubles", () => {
  const dice = [2, 4];

  expect(getAvailableDice(dice, [])).toEqual([2, 4]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,
        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([4]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 5,
        dieUsed: 4,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([2]);

  expect(
    getAvailableDice(dice, [
      {
        from: 1,
        to: 3,

        dieUsed: 2,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
      {
        from: 1,
        to: 5,
        dieUsed: 4,
        checkerOwner: Player.One,
        hitStatus: HitStatus.NoHit,
      },
    ])
  ).toEqual([]);
});
