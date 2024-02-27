import { Player } from "../../Types";
import { getAvailableDice } from "../dice";

test("getAvailableDice works for doubles", () => {
  const dice = [2, 2, 2, 2];
  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([2, 2, 2]);

  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 4,
          to: 6,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([2, 2]);

  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 4,
          to: 6,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 6,
          to: 8,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([2]);

  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 4,
          to: 6,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 6,
          to: 8,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 8,
          to: 10,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
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
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([4]);

  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 5,
        },
        dieUsed: 4,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([2]);

  expect(
    getAvailableDice(dice, [
      {
        move: {
          from: 1,
          to: 3,
        },
        dieUsed: 2,
        checkerOwner: Player.One,
        isHit: false,
      },
      {
        move: {
          from: 1,
          to: 5,
        },
        dieUsed: 4,
        checkerOwner: Player.One,
        isHit: false,
      },
    ])
  ).toEqual([]);
});
