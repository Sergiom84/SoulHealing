// Modo local: siempre hay un "usuario" local para compatibilidad.
export function useUser() {
  return { user: { id: 'local-user', email: 'local@device' }, loading: false };
}
