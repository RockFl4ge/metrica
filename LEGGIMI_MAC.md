# Metrica 1.0 per Mac Intel

Applicazione desktop Tauri 2 che riutilizza interfaccia, calcoli e modello dati della PWA Metrica. Usa WKWebView di macOS, ha una finestra indipendente e funziona offline. Non è una riscrittura in Swift.

Destinazione: MacBook Pro Intel con macOS Ventura 13.7.8. Il target è x86_64-apple-darwin e la versione minima configurata è macOS 13.0. La finestra iniziale è 1.180 x 700 punti ed è ridimensionabile.

## Stato effettivo della consegna

Il codice deriva dal repository https://github.com/RockFl4ge/metrica, commit a6d735c88159dea33ae2755e2ce5339041b9facc, recuperato il 3 novembre 2026. Il repository conteneva la PWA, ma non i precedenti ZIP Tauri citati nella chat: l'integrazione desktop è stata ricostruita sulla PWA effettivamente disponibile.

Verifiche svolte su Windows:
- 23 test JavaScript superati: 15 originali e 8 per avvio desktop, importazione, annullamenti, errori di memoria ed esportazione.
- Installazione npm ci riuscita con package-lock.json.
- Configurazione controllata rispetto allo schema Tauri della CLI e workflow controllato con actionlint.
- Icone macOS generate dall'icona PWA esistente.
- Preparazione delle risorse desktop completata mediante elenco chiuso.
- Prova in Microsoft Edge con la policy CSP desktop: cinque sezioni, importazione, ricaricamento ed esportazione riusciti, senza errori JavaScript. Le chiamate native erano simulate.

Non eseguiti: compilazione Rust, generazione effettiva del DMG, avvio WKWebView su macOS e collaudo sul Mac Ventura. La validazione statica del workflow non sostituisce una sua esecuzione riuscita. Non viene consegnato un DMG già compilato.

## Strumenti e accessi necessari

Per ottenere il DMG tramite GitHub servono un account GitHub con permesso di scrittura sul repository e la possibilità di eseguire GitHub Actions. Non occorre fornire password o token a chi prepara il progetto.

Sul Mac dell'utente non servono Xcode, Rust, Node.js, npm o GitHub Desktop per installare e usare il risultato. Servono Finder e un browser per scaricare il pacchetto. Per caricare comodamente tutte le cartelle del progetto, comprese quelle nascoste, si può usare GitHub Desktop; è facoltativo.

Sul runner GitHub servono gli strumenti Apple e l'SDK macOS già presenti nell'immagine, Rust e Node.js. Il workflow seleziona macos-15-intel, prepara Rust stable e il target Intel, installa le dipendenze e compila app e DMG. Il sistema operativo del runner è distinto da quello minimo dell'app: la build imposta MACOSX_DEPLOYMENT_TARGET=13.0.

Un account Apple Developer non è necessario per questa build personale con firma ad hoc. Per una distribuzione con Developer ID e notarizzazione servono iscrizione Apple Developer, certificato Developer ID Application con chiave privata e credenziali Apple di notarizzazione. Questi segreti vanno configurati nei Secrets di GitHub, mai nei sorgenti. Il workflow consegnato non usa tali credenziali e non notarizza.

I runner standard sono attualmente gratuiti per i repository pubblici. Nei repository privati si applicano quote e condizioni del proprio piano: verificarle nell'account prima di avviare la build.

## Caricare il progetto e generare il DMG

1. Estrai lo ZIP. Il contenuto di Metrica-Mac deve andare nella radice del repository, accanto a index.html. Non caricare la cartella Metrica-Mac come sottocartella e non caricare lo ZIP come singolo file.
2. Usa preferibilmente una copia o un branch di lavoro. Per visualizzare .github nel Finder premi Cmd + Maiusc + .; deve essere presente .github/workflows/build-mac-intel.yml. Non aggiungere archivi JSON personali.
3. Puoi caricare i file dalla pagina Code tramite Add file > Upload files, mantenendo le cartelle. Se l'interfaccia omette .github, apri Add file > Create new file, inserisci come nome .github/workflows/build-mac-intel.yml e incolla il contenuto del file locale omonimo. Conferma il commit. Il workflow con workflow_dispatch deve essere presente nel branch predefinito per apparire come avviabile.
4. Nel repository apri Actions > Crea Metrica per Mac Intel > Run workflow. Se Actions è disabilitato, abilitalo nelle impostazioni del repository; un'organizzazione potrebbe richiedere l'intervento del suo amministratore.
5. Attendi l'esito. Il workflow esegue i test, genera le icone, compila, controlla Intel x86_64, versione minima dei binari inclusi e firma ad hoc.
6. A esecuzione riuscita, apri la relativa pagina e scarica Artifacts > Metrica-1.0.0-mac-Intel. Devi essere autenticato su GitHub. L'artefatto contiene DMG, copia .app compressa con ditto, SHA256SUMS.txt, informazioni sui binari e Cargo.lock. La conservazione richiesta è di 30 giorni, nei limiti delle impostazioni del repository.
7. Estrai l'artefatto, apri il DMG e trascina Metrica in Applicazioni. Espelli il DMG e avvia Metrica da Applicazioni.

Non viene pubblicata automaticamente una GitHub Release. Il workflow ha permessi di sola lettura sul repository e carica soltanto l'artefatto della propria esecuzione.

## Gatekeeper su Ventura

Questa build usa una firma ad hoc: garantisce la coerenza interna verificabile del pacchetto, ma non identifica uno sviluppatore Apple e non equivale alla notarizzazione. Gatekeeper può bloccarla.

Dopo aver scaricato il risultato della propria esecuzione GitHub, verifica la provenienza. Per confrontare il digest, nel Terminale del Mac usa shasum -a 256 seguito da uno spazio e trascina il DMG nella finestra; confronta il valore con SHA256SUMS.txt scaricato dalla stessa esecuzione. Il digest rileva differenze tra file, ma non certifica da solo l'identità dello sviluppatore.

Prova ad aprire Metrica da Applicazioni. Se compare il blocco dello sviluppatore non identificato, su Ventura usa clic con Ctrl sull'app > Apri oppure Impostazioni di Sistema > Privacy e sicurezza > Apri comunque, dopo il primo tentativo. Conferma soltanto per il pacchetto che hai verificato. Non occorre disattivare globalmente Gatekeeper.

Se l'avviso parla di malware o di file danneggiato, oppure il digest differisce, interrompi l'apertura e controlla il pacchetto e il log della build. Non trattare tutti gli avvisi come semplici richieste di autorizzazione. Eventuali criteri di gestione aziendale possono impedire l'eccezione.

La build personale macOS non ha il rinnovo ogni sette giorni della firma gratuita di sviluppo iOS.

## Dati locali e importazione JSON

Al primo avvio desktop l'archivio è vuoto. Il profilo mostra valori iniziali sintetici da modificare nelle impostazioni. I dati demo sono facoltativi e si possono caricare esplicitamente. Nel pacchetto non è incluso alcuno storico personale o Excel.

Per trasferire lo storico dalla PWA:
1. Nella PWA originale apri Impostazioni > Esporta dati in JSON.
2. Conserva il JSON sul Mac in una posizione privata. Non caricarlo su GitHub e non metterlo nella cartella dei sorgenti pubblici.
3. In Metrica desktop apri Impostazioni > Importa archivio JSON, scegli il file locale e conferma il riepilogo.
4. L'importazione sostituisce l'archivio attuale: prima esporta un backup del desktop se contiene dati da conservare.

Il formato atteso è quello esportato da Metrica 1.0: oggetto JSON con schemaVersion 1, profile, days e sports. Non è un'importazione diretta di un qualsiasi Excel. L'app limita il file a 15.000.000 byte e normalizza i dati; le date non valide possono essere scartate. Dopo l'importazione controlla conteggi e registrazioni significative. Gli archivi privati citati nella vecchia chat non sono stati recuperati in questa consegna: se non possiedi quel JSON, esporta l'archivio attuale della PWA.

Importazione, esportazione e conferme passano da finestre native attraverso tre comandi Rust. Nessun percorso arbitrario del disco viene accettato dal JavaScript: il file viene selezionato dall'utente nella finestra nativa. La conservazione ordinaria usa localStorage della WKWebView, separato dal browser e dagli altri dispositivi. I dati non vengono sincronizzati con iPhone, Android o cloud.

Il database locale non è cifrato dall'app e il JSON esportato è in chiaro. Conserva i backup in una posizione privata. Cancellare i dati dell'app, ripristinare il computer o perdere il profilo utente può far perdere lo storico.

## Aggiornamenti

La versione consegnata non include un aggiornamento automatico. Modificare la PWA online non modifica l'app desktop già installata.

Per una versione successiva:
1. Mantieni l'identificativo io.github.rockfl4ge.metrica, la chiave metrica_v1_personal_archive e la compatibilità dei dati. Aggiorna coerentemente la versione in package.json, package-lock.json, Cargo.toml e tauri.conf.json, oltre alle etichette del workflow.
2. Ricompila e scarica il nuovo DMG. Prima esporta un backup dall'app esistente e chiudila.
3. Sostituisci Metrica.app in Applicazioni. Non eliminare gli archivi dell'utente con programmi di disinstallazione.
4. Riapri e controlla lo storico. La conservazione è prevista con identificativo e origine stabili, ma deve essere verificata al primo aggiornamento reale. Se necessario usa il backup JSON.

Per mantenere anche l'origine di archiviazione della WKWebView, conserva il protocollo Tauri e la relativa configurazione. Un cambio di identificativo o origine richiede una migrazione esplicita.

Un futuro aggiornamento automatico richiederà il plugin updater di Tauri, artefatti di aggiornamento firmati e un endpoint HTTPS. Le chiavi dell'updater sono distinte dalla firma Apple; non sono incluse o necessarie in questa versione.

Le versioni dirette di Tauri e della CLI sono bloccate, così come le dipendenze npm. Cargo.lock non è stato generato su Windows, dove Rust non è installato: la prima build risolve le dipendenze Rust transitive e allega il lock all'artefatto. Per congelare le build successive, conserva quel Cargo.lock in src-tauri e usa la modalità --locked dopo averlo verificato. Rust stable sul runner può cambiare; per riproducibilità più stretta va poi fissata anche la toolchain effettivamente collaudata.

## Collaudo finale sul Mac

Dopo la prima compilazione riuscita restano da verificare sul Mac Intel con Ventura 13.7.8: avvio da Applicazioni, layout alla propria risoluzione, registrazione di una giornata, chiusura e riapertura, importazione JSON annullata e confermata, esportazione con successiva reimportazione, funzionamento senza rete. Esporta prima eventuali dati reali. Il controllo del deployment target in CI non sostituisce questi controlli WKWebView.

## Riferimenti ufficiali

- Pipeline Tauri per GitHub: https://v2.tauri.app/distribute/pipelines/github/
- Runner GitHub, architetture e condizioni: https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- Configurazione Tauri e minimumSystemVersion: https://v2.tauri.app/reference/config/
- Firma e notarizzazione macOS: https://v2.tauri.app/distribute/sign/macos/
- Gatekeeper: https://support.apple.com/it-it/102445

La cartella di supporto usata per preparare questa consegna contiene originali, strumenti e risultati delle verifiche. Non è necessaria per compilare il progetto o usare l'app.
