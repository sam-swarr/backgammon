import { Auth, User, getAuth, signInAnonymously } from "firebase/auth";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Firestore,
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { GameState } from "./store/gameStateSlice";

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

export async function getCurrentUser(): Promise<User> {
  initialize();

  if (auth.currentUser != null) {
    return auth.currentUser;
  }

  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

export async function createLobby(): Promise<string> {
  initialize();

  const roomCode = createRoomCode();

  const docRef = await addDoc(collection(db, "lobbies"), {
    roomCode: roomCode,
    players: [
      {
        uid: (await getCurrentUser()).uid,
      },
    ],
    gameState: GameState.NotStarted,
  });

  console.log("Document written with ID: ", docRef.id);
  console.log("Created room: " + roomCode);

  return roomCode;
}

// Add a new document with a generated id.
