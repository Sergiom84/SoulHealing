import React from 'react';
import { useUserProfile, getTimeBasedGreeting } from '@/hooks/useUserProfile';
import { useUser } from '@/hooks/useUser';

export default function UserGreeting() {
  const { user } = useUser();
  const { profile, loading } = useUserProfile(user?.id);
  const greeting = getTimeBasedGreeting();

  if (loading || !profile) {
    return null;
  }

  return (
    <div className="text-base font-medium"> {/* Aumentado el tamaño de texto de sm a base */}
      <span className="text-gray-400">
        {greeting},
      </span>{' '}
      <span className="text-primary text-lg"> {/* Aumentado el tamaño y usando el color primario (azul) */}
        {profile.display_name}
      </span>
    </div>
  );
}
