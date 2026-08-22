'use client';

import NextTopLoader from 'nextjs-toploader';
import { useEffect, useState } from 'react';

export default function TopLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextTopLoader
      color="#2563eb"
      height={4}
      showSpinner={false}
    />
  );
}
