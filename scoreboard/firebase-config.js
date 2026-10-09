// ─────────────────────────────────────────────────────────────────────────────
// Incolla qui la config della tua Web App Firebase
// (Console Firebase → Impostazioni progetto → Le tue app → Config SDK).
// Questi valori sono pubblici per design: la sicurezza è nelle Database Rules.
// ─────────────────────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyAuE923vi7zRjsVtUTxuAWW8b3m0UmK9dM",
  authDomain: "scoreboardscualo.firebaseapp.com",
  // Verifica che coincida con l'URL mostrato in Realtime Database → Dati
  databaseURL: "https://scoreboardscualo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scoreboardscualo",
  storageBucket: "scoreboardscualo.firebasestorage.app",
  messagingSenderId: "961913880803",
  appId: "1:961913880803:web:ab4ee1a29556d414be85d6",
};

// Repo GitHub dove si trova la cartella dei loghi (usata dal pannello per elencarli)
export const logoRepo = {
  owner: "HSteex",
  repo: "HSteex.github.io",
  path: "scoreboard/loghi",
};
