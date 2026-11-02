# Metrica — PWA 1.0

Diario alimentare e sportivo con analisi del peso e del bilancio energetico. Interfaccia responsive in italiano; non richiede account, server applicativo, librerie esterne né compilazione JavaScript. Il codice è adatto a GitHub Pages.

## Funzioni disponibili

- **Home**: bilancio netto, calorie assunte, TDEE, calorie sportive, BMI, peso reale e stimato, macronutrienti e messaggi ironici.
- **Diario**: inserimento e modifica di calorie, proteine, carboidrati, grassi, fibre, passi o distanza giornaliera, peso da bilancia e note. Storico consultabile per data.
- **Sport**: corsa, bici, escursioni, nuoto, sci, camminata, palestra, basket e altro. Distanza, durata, tempo totale, dislivello, intensità, calorie e note dove pertinenti. La palestra richiede soltanto durata e calorie, con intensità facoltativa per la stima.
- **Grafici sportivi**: filtro per disciplina e periodo; distanza, velocità, passo, tempo, dislivello e calorie, quando applicabili. Calcolo automatico di velocità, passo e pause.
- **Analisi**: andamento del peso misurato, media delle ultime sette pesate, previsione teorica, calorie, TDEE, bilancio e passi.
- **Impostazioni**: età, sesso, altezza, obiettivi, valori del modello energetico, punto iniziale della previsione, import/export JSON e reset.
- **PWA**: icona installabile, layout mobile e cache dell'interfaccia per un uso offline dopo la prima apertura riuscita.

## Pubblicazione su GitHub Pages — senza Xcode

1. Crea un repository pubblico su https://github.com/new (esempio `metrica-app`).
2. **Estrai lo ZIP e carica il contenuto della cartella**, non lo ZIP: `index.html`, `app.js`, `core.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icons/` ecc. devono trovarsi nella **radice del repository**.
3. Apri `Settings` → `Pages`.
4. In `Build and deployment`, scegli **Deploy from a branch**; branch `main`, cartella `/(root)`, poi `Save`.
5. Una volta pubblicato, apri `https://TUO-USERNAME.github.io/metrica-app/` (sostituisci username e nome repository).
6. Su iPhone apri il link con Safari, usa **Condividi → Aggiungi alla schermata Home** e, se presente, **Apri come app**.

Il sito deve essere aperto via HTTPS/localhost per registrare il service worker. Fare doppio clic su `index.html` dal computer non è una modalità di prova affidabile, perché i moduli JavaScript possono essere bloccati dal browser in modalità `file://`.

### Prova locale (facoltativa)

Apri un terminale nella cartella estratta e avvia `python3 -m http.server 8000` (su Windows può essere `py -m http.server 8000`), poi visita `http://localhost:8000`.

## Importazione del diario Excel

Il codice ZIP **non contiene lo storico personale**. Riceverai a parte `Metrica_v1.0_STORICO_PRIVATO.json`.

Dopo l'apertura dell'app: `Impostazioni → Importa archivio JSON`, scegli il file e conferma. Verranno importati 25 giorni alimentari e 11 sessioni sportive. La importazione **sostituisce** l'archivio presente, inclusa la demo.

**Non caricare il JSON privato sul repository GitHub pubblico.** Contiene dati su peso, alimentazione e attività e deve restare sul dispositivo o in un archivio privato. Anche i dati che salvi nell'app restano nel browser che stai usando, non vengono trasferiti agli altri dispositivi: esporta un backup prima di cambiare browser o cancellarne i dati.

### Note sull'importazione

- Il file Excel conteneva valori storici di TDEE calcolati con BMR × 1,4. Per le giornate precedenti, questi valori vengono conservati finché non inserisci passi o distanza giornaliera: le nuove giornate usano il TDEE dinamico.
- Le calorie delle attività importate sono trattate come calorie aggiuntive dichiarate nel vecchio diario. La loro base energetica effettiva (totale/attiva) non è sempre verificabile dai dati disponibili.
- Un'attività di basket presenta una durata scritta come `1` senza unità: è stata interpretata come **1 ora**, segnalando l'ipotesi nelle note dell'attività. Puoi correggerla nell'app.
- I dati mancanti rimangono vuoti, non diventano zero. Non sono stati importati i fogli relativi allo studio.
- Sono presenti giorni senza calorie o peso aggiornati dopo l'ultimo giorno del diario: non vengono importati come giornate fittizie.

## Modello energetico v1.0

Per ogni giornata:

- **BMR**: formula di Mifflin–St Jeor, con peso più recente disponibile a quella data.
- **Base quotidiana**: BMR × fattore configurabile, inizialmente 1,20. Il coefficiente comprende attività ordinarie di fondo e rappresenta un'approssimazione.
- **Passi**: se presenti passi o km percorsi, l'energia viene corretta sopra o sotto il movimento di base assunto. La conversione passi/distanza usa una stima della lunghezza del passo basata sull'altezza, modificabile indirettamente agendo sui parametri.
- **Sport**: calorie *attive* inserite manualmente o stima netta basata su valori MET. Se si inseriscono calorie *totali* e durata, viene sottratta la quota stimata di dispendio a riposo. Se corsa, camminata o escursione sono già inclusi nei passi/chilometri del telefono, l'app sottrae la quota sportiva dalla componente quotidiana.
- **TDEE stimato** = base quotidiana + variazione da passi + calorie sportive aggiuntive.
- **Bilancio stimato** = calorie assunte − TDEE; deficit negativo, surplus positivo.
- **Peso teorico** = peso alla data di riferimento + somma dei bilanci dei soli giorni registrati / 7.700 kcal/kg.

**Limiti**: queste sono stime sperimentali, non misurazioni cliniche; il fattore 7.700 kcal/kg non equivale a un calcolo diretto della massa grassa, i MET non forniscono il consumo reale individuale e possono essere presenti errori di misurazione. La registrazione di calorie e sport richiede inserimento manuale: in v1.0 non c'è sincronizzazione con Strava, Salute di Apple o banche dati alimentari.

Riferimenti metodologici: https://pacompendium.com/adult-compendium/ e https://www.niddk.nih.gov/bwp

## Test

Richiede Node.js installato soltanto per eseguire i test: `npm test`. La PWA pubblicata non richiede Node.js.

## Dati e sicurezza

- Il salvataggio usa `localStorage` nel browser e non prevede server o login.
- La demo contiene solamente dati **inventati**.
- In caso di smarrimento del browser o dei dati del sito, le registrazioni possono andare perse; l'export JSON è il meccanismo di backup e trasferimento.
- Una versione futura potrebbe aggiungere database privato, autenticazione e sincronizzazione tra dispositivi.
