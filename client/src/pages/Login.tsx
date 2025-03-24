import Auth from '@/components/Auth';

export default function LoginPage() {
  return (
    <div className="p-6">
      <Auth onAuthSuccess={() => window.location.href = '/'} />
    </div>
  );
}
