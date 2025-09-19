import { useState, useEffect } from 'react';

interface SimpleUser {
  name: string;
}

export function useSimpleUser() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un nombre guardado en localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUser({ name: savedName });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('userName');
    setUser(null);
  };

  return {
    user,
    loading,
    logout
  };
}