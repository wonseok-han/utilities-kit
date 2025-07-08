import { Button } from '@repo/ui/button';

export default function Home() {
  return (
    <div>
      <div className="text-blue-500 text-2xl mb-4">Tailwind 테스트</div>
      <Button appName="dev-tools">확인</Button>
    </div>
  );
}
