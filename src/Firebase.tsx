import { Auth, User, getAuth, signInAnonymously } from "firebase/auth";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { GameState } from "./store/gameStateSlice";
import { PlayersDataPayload } from "./store/playersSlice";
import { performInitialRolls, rollDiceImpl } from "./store/dice";
import { DiceData } from "./store/diceSlice";
import { GameBoardState, Player } from "./Types";
import { STARTING_BOARD_STATE } from "./Constants";
import { NetworkedMovesPayload } from "./store/animatableMovesSlice";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBEAjHStQSJVxt6gxABDueJ4JdSPEjlHXE",
  authDomain: "backgammon-574d7.firebaseapp.com",
  projectId: "backgammon-574d7",
  storageBucket: "backgammon-574d7.appspot.com",
  messagingSenderId: "455319890911",
  appId: "1:455319890911:web:43cfebdc213fa57a44726a",
  measurementId: "G-74HHQTBN9B",
};

let initialized: boolean = false;
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initialize() {
  if (initialized) {
    return;
  }
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  initialized = true;
}

export function createRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getDB(): Firestore {
  initialize();
  return db;
}

export async function signIn(): Promise<User> {
  initialize();

  if (auth.currentUser != null) {
    return auth.currentUser;
  }

  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

export function getCurrentUser(): User {
  initialize();

  if (auth.currentUser != null) {
    return auth.currentUser;
  }

  throw Error("Trying to access current user without signing in.");
}

export type FirestoreGameData = {
  gameBoard: GameBoardState;
  gameState: GameState;
  players: PlayersDataPayload;
  currentPlayer: Player;
  dice: DiceData;
  networkedMoves: NetworkedMovesPayload;
  roomCode: string;
};

type CreateLobbyResult = {
  roomCode: string;
  docRef: DocumentReference;
};

export async function createLobby(): Promise<CreateLobbyResult> {
  initialize();

  const roomCode = createRoomCode();
  const initialRolls = performInitialRolls();
  const startingRoll = initialRolls[Object.keys(initialRolls).length - 1];

  const docRef = await addDoc(collection(db, "lobbies"), {
    roomCode: roomCode,
    gameBoard: STARTING_BOARD_STATE,
    gameState: GameState.WaitingForPlayers,
    players: {
      playerOne: {
        uid: (await signIn()).uid,
        username: "Sam",
      },
      playerTwo: null,
    },
    currentPlayer: startingRoll[0] > startingRoll[1] ? Player.One : Player.Two,
    dice: {
      initialRolls: initialRolls,
      currentRoll: startingRoll,
    },
    networkedMoves: null,
    timeCreated: serverTimestamp(),
  });

  console.log("Document written with ID: ", docRef.id);
  console.log("Created room: " + roomCode);

  return {
    roomCode,
    docRef,
  };
}

export async function findLobby(
  roomCode: string
): Promise<DocumentReference | null> {
  initialize();

  const lobbiesRef = collection(db, "lobbies");
  const q = query(
    lobbiesRef,
    where("roomCode", "==", roomCode),
    orderBy("timeCreated", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs[0].ref;
}

export async function joinLobbyAsPlayerTwo(docRef: DocumentReference) {
  return await setDoc(
    docRef,
    {
      players: {
        playerTwo: {
          uid: getCurrentUser().uid,
          username: "Opponent",
        },
      },
    },
    { merge: true }
  );
}

export function hasJoinedLobby(playersData: PlayersDataPayload): boolean {
  let uid = getCurrentUser().uid;
  return (
    (playersData.playerOne != null && playersData.playerOne.uid === uid) ||
    (playersData.playerTwo != null && playersData.playerTwo.uid === uid)
  );
}

export async function writeNewGameStateToDB(
  docRef: DocumentReference,
  newGameState: GameState
) {
  return await setDoc(
    docRef,
    {
      gameState: newGameState,
    },
    { merge: true }
  );
}

export async function writeEndTurnToDB(
  docRef: DocumentReference,
  newGameBoardState: GameBoardState,
  newCurrentPlayer: Player,
  networkedMoves: NetworkedMovesPayload
) {
  return await setDoc(
    docRef,
    {
      gameBoard: newGameBoardState,
      currentPlayer: newCurrentPlayer,
      dice: {
        currentRoll: rollDiceImpl(),
      },
      gameState: GameState.PlayerRolling,
      networkedMoves,
    },
    { merge: true }
  );
}
