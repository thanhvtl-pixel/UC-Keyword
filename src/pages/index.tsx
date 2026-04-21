import React from 'react';
import dynamic from 'next/dynamic';

const UrCardPortal = dynamic(
  () => import('../app/components/UrCardPortal').then((mod) => mod.UrCardPortal),
  { ssr: false }
);

export default function Home() {
  return (
    <UrCardPortal />
  );
}
