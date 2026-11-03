# Metrica 1.0
Diario alimentare e sportivo locale con interfaccia italiana, grafici e importazione/esportazione JSON.

Per il progetto desktop Mac Intel, la compilazione GitHub, la gestione dei dati e i limiti verificati leggere [LEGGIMI_MAC.md](LEGGIMI_MAC.md).

La PWA rimane nei file index.html, app.js, core.js, desktop.js, styles.css, sw.js e manifest.webmanifest, con la cartella icons. Per GitHub Pages pubblicare dalla radice del repository. Il service worker conserva soltanto l'interfaccia; lo storico è locale e va esportato periodicamente.

Per una prova PWA con Python disponibile: su Windows usare py -m http.server 8000 nella cartella e aprire http://localhost:8000. Per i test servono Node.js e npm: npm ci, poi npm test.

Il modello energetico esistente è mantenuto: BMR Mifflin-St Jeor, base quotidiana configurabile, correzione del movimento e sport, stima teorica del peso basata sul bilancio cumulato. Sono stime indicative e non misure cliniche.

I valori iniziali e la demo sono sintetici. Non caricare dati personali nel repository pubblico. Non sono inclusi diari o JSON privati.
