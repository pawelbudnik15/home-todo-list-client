import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full border-0" style={{ backgroundColor: '#0d0d0d', height: '200px' }}>
      <div className="container mx-auto px-4 py-4 h-full relative">
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Image src="/logo.png" alt="Logo" width={226} height={48} />
        </div>
      </div>
    </header>
  );
}