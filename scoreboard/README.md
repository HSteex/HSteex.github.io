# Tabellone calcio per OBS

- `widget.html` – overlay da usare in OBS (sfondo trasparente)
- `control.html` – pannello di controllo, pensato per il telefono
- `loghi/` – loghi delle squadre (PNG quadrati, sfondo trasparente consigliato)

I dati passano da Firebase Realtime Database (piano gratuito Spark): il widget si aggiorna da solo in tempo reale.

## Setup (una volta sola)

1. **Progetto Firebase**: vai su <https://console.firebase.google.com> → *Aggiungi progetto* (Analytics non serve).
2. **Web App**: nella panoramica del progetto clicca l'icona `</>` → registra l'app (niente Hosting) → copia l'oggetto `firebaseConfig` dentro [`firebase-config.js`](firebase-config.js).
3. **Realtime Database**: *Build → Realtime Database → Crea database* → regione `europe-west1` → modalità bloccata. Controlla che `databaseURL` in `firebase-config.js` corrisponda all'URL mostrato in alto.
4. **Utente**: *Build → Authentication → Inizia → Email/Password* (abilita) → scheda *Users → Aggiungi utente* con la tua email e una password. Copia l'**UID** dell'utente creato.
5. **Regole**: *Realtime Database → Regole* → incolla il contenuto di [`database.rules.json`](database.rules.json) sostituendo `INCOLLA_QUI_IL_TUO_UID` → *Pubblica*. Così chiunque può leggere (serve al widget) ma solo tu puoi scrivere.
6. **Domini autorizzati**: *Authentication → Settings → Authorized domains* → aggiungi `hsteex.github.io` (serve per il login dal pannello).
7. Fai commit e push: le pagine sono su `https://hsteex.github.io/scoreboard/`.

## Uso

- **Telefono**: apri `https://hsteex.github.io/scoreboard/control.html`, accedi (il login resta salvato).
- **OBS / Streamlabs**: sorgente *Browser* → URL `https://hsteex.github.io/scoreboard/widget.html`. Il tabellone si adatta da solo alla dimensione della sorgente: per ingrandirlo basta ridimensionare la sorgente (es. 1000×100). `?scale=1.5` forza invece una scala fissa.
- **Durata tempi**: nelle Impostazioni (default 40' tempo, 15' supplementare). Il 2° tempo riparte da 40:00; oltre la durata il tempo resta fermo e compare il recupero in giallo (`+1:23`).
- **Loghi**: PNG piccoli, **max 256×256 px**, nomi senza accenti né spazi (un logo 8000×8000 fa scattare Streamlabs). Carica i file in `scoreboard/loghi/` (anche dal sito GitHub con *Add file → Upload files*), aspetta ~1 minuto che Pages li pubblichi, poi nel pannello premi *Aggiorna elenco loghi* e sceglili dal menu.

## Prova in locale

Serve un server (i moduli ES non funzionano da `file://`):

```sh
python -m http.server 8000
```

poi apri `http://localhost:8000/scoreboard/control.html` e `http://localhost:8000/scoreboard/widget.html` (`localhost` è già tra i domini autorizzati di Firebase).
