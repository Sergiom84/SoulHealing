import React from 'react';
// import { useUserProfile, getTimeBasedGreeting } from '@/hooks/useUserProfile'; // Comentado
// import { useUser } from '@/hooks/useUser'; // Comentado
import { useSimpleUser } from '@/hooks/useSimpleUser';

// Función simplificada para saludo
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function UserGreeting() {
  const { user } = useSimpleUser();
  const greeting = getTimeBasedGreeting();

  if (!user) {
    return null;
  }

  return (
    <div className="text-base font-medium">
      <span className="text-gray-400">
        {greeting},
      </span>{' '}
      <span className="text-primary text-lg">
        {user.name}
      </span>
    </div>
  );
}
