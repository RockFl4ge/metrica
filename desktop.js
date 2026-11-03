export const isDesktop = () => !!globalThis.window?.__TAURI__?.core?.invoke;
const invoke = (command, args) => window.__TAURI__.core.invoke(command, args);
export async function confirmAction(message) {
 return isDesktop() ? invoke('confirm_action', {message}) : window.confirm(message);
}
export async function saveArchive(contents, filename) {
 return invoke('export_archive', {contents, filename});
}
export async function pickArchive() {
 const contents = await invoke('import_archive');
 return contents === null ? null : {size: new TextEncoder().encode(contents).length, text: async () => contents};
}
