#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::io::Read;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};

const MAX_ARCHIVE_BYTES: u64 = 15_000_000;

#[tauri::command]
async fn confirm_action(app: tauri::AppHandle, message: String) -> Result<bool, String> {
    tauri::async_runtime::spawn_blocking(move || {
        app.dialog().message(message).title("Metrica")
            .buttons(MessageDialogButtons::OkCancel).blocking_show()
    }).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn import_archive(app: tauri::AppHandle) -> Result<Option<String>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let Some(selected) = app.dialog().file().add_filter("Archivio JSON", &["json"]).blocking_pick_file() else {
            return Ok(None);
        };
        let file = std::fs::File::open(selected.into_path().map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string())?;
        let mut contents = String::new();
        file.take(MAX_ARCHIVE_BYTES + 1).read_to_string(&mut contents).map_err(|e| e.to_string())?;
        if contents.len() as u64 > MAX_ARCHIVE_BYTES { return Err("File troppo grande.".into()); }
        Ok(Some(contents))
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
async fn export_archive(app: tauri::AppHandle, contents: String, filename: String) -> Result<bool, String> {
    if contents.len() as u64 > MAX_ARCHIVE_BYTES { return Err("Archivio troppo grande.".into()); }
    // Il percorso proviene soltanto dalla finestra nativa.
    let filename = std::path::Path::new(&filename).file_name()
        .and_then(|p| p.to_str()).unwrap_or("metrica-backup.json").to_owned();
    tauri::async_runtime::spawn_blocking(move || {
        let Some(selected) = app.dialog().file().add_filter("Archivio JSON", &["json"])
            .set_file_name(filename).blocking_save_file() else { return Ok(false); };
        std::fs::write(selected.into_path().map_err(|e| e.to_string())?, contents).map_err(|e| e.to_string())?;
        Ok(true)
    }).await.map_err(|e| e.to_string())?
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![confirm_action, import_archive, export_archive])
        .run(tauri::generate_context!())
        .expect("Impossibile avviare Metrica");
}
