// Estado compartido de usuarios sincronizados
let usuariosSync: any[] | null = null;

export function setUsuariosSincronizados(usuarios: any[]) {
  usuariosSync = usuarios;
}

export function getUsuariosSincronizados() {
  return usuariosSync;
}

export function resetUsuariosSincronizados() {
  usuariosSync = null;
}
