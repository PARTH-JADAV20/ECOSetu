'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '../../../components/AppLayout';
import { BoMCreate } from '../../../components/BoMCreate';

function BoMCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') || '';

  const handleNavigate = (page: any) => {
    switch (page.name) {
      case 'bom-list':
        router.push('/bom');
        break;
      case 'bom-detail':
        router.push(`/bom/${page.id}`);
        break;
      default:
        break;
    }
  };

  return <BoMCreate onNavigate={handleNavigate} productId={productId} />;
}

export default function BoMCreatePage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <BoMCreateContent />
      </Suspense>
    </AppLayout>
  );
}
