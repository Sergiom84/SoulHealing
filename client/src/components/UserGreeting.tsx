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
    <div className="text-sm font-medium text-muted-foreground">
      {greeting}, <span className="text-primary">{profile.display_name}</span>
    </div>
  );
}
