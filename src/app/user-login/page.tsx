import UserLoginForm from '../../components/UserLoginForm';
import RetroGrid from '@/components/RetroGrid';

export default function UserLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <RetroGrid />
      <UserLoginForm />
    </div>
  );
}
