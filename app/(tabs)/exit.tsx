import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ExitTab() {
  const router = useRouter();

  useEffect(() => {
    router.push('/screens/exit');
  }, [router]);

  return null;
}
