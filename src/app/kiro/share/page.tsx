'use client';

import { Suspense } from 'react';
import ShareClient from './ClientPage';

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    }>
      <ShareClient />
    </Suspense>
  );
}
