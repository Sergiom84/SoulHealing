import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí colocarías la lógica para registrar al usuario (por ejemplo, utilizando supabase.auth.signUp)
    // Opcional: confirmar que el email fue introducido
    console.log('Registrando usuario, email proporcionado:', !!email);
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
