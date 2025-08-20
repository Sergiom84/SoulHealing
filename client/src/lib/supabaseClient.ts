// Stub local para mantener compatibilidad con componentes existentes.
export const supabase = {
  auth: {
    async getSession() {
      return { data: { session: { user: { id: 'local-user', email: 'local@device' } } }, error: null };
    },
    async getUser() {
      return { data: { user: { id: 'local-user', email: 'local@device' } }, error: null };
    },
    onAuthStateChange(_cb: any) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    async signOut() { return { error: null }; },
    async signInWithOAuth(_opts: any) { return { error: null }; },
    async signInWithPassword(_opts: any) { return { data: {}, error: null }; },
    async signUp(_opts: any) { return { data: {}, error: null }; },
  },
};
