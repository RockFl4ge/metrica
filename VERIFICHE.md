# Esito delle verifiche - 3 novembre 2026

| Controllo | Esito |
| --- | --- |
| Base PWA recuperata da GitHub, commit documentato | Completato |
| Test JavaScript originali | 15/15 superati |
| Test del collegamento desktop simulato | 8/8 superati |
| Installazione da package-lock con npm ci | Riuscita |
| Schema ufficiale della configurazione Tauri | Struttura e campi usati validi |
| Workflow GitHub Actions, actionlint | Nessun errore; shellcheck e pyflakes non eseguiti |
| Generazione icona ICNS | Riuscita |
| Preparazione risorse mediante elenco chiuso | Riuscita, 8 file senza diari |
| Prova browser Edge con CSP desktop | Cinque sezioni e ciclo importazione-riapertura-esportazione riusciti |
| Archivi personali, Excel e credenziali nel pacchetto | Nessuno incluso |
| Compilazione Rust / DMG su macOS | Non eseguita |
| Controllo binari x86_64 e deployment target | Previsto nel workflow, non ancora eseguito |
| Firma ad hoc sul binario e verifica codesign | Previste nel workflow, non ancora eseguite |
| Avvio e import/export nativi WKWebView su Ventura | Da collaudare sul Mac |

La destinazione configurata è Intel x86_64, macOS minimo 13.0. La compatibilità con Ventura 13.7.8 è un obiettivo di build, non un risultato di un collaudo già svolto. Il runner scelto è macos-15-intel, verificato nella documentazione GitHub consultata.

Il codice JavaScript è stato controllato ed eseguito. Il codice Rust è stato revisionato rispetto alle API documentate del plugin dialog, ma non compilato: l'ambiente Windows non dispone di Rust e di un SDK Apple. Il browser di prova simula le chiamate Rust e non dimostra il funzionamento delle finestre native.

Nessuna modifica è stata pubblicata nel repository online e nessuna esecuzione GitHub è stata avviata. Non sono state configurate credenziali, firma Developer ID, notarizzazione o aggiornamento automatico.

Le dipendenze dirette sono fissate. La prima build Rust risolve quelle transitive; Cargo.lock viene allegato all'artefatto e va conservato per congelare le build successive. Una build CI riuscita resta il prossimo controllo necessario.
