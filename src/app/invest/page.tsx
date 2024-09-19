import dynamic from 'next/dynamic';

const InvestmentForm = dynamic(() => import('@/components/InvestmentForm'), {
  ssr: false
});

export default function InvestPage() {
  return <InvestmentForm />;
}