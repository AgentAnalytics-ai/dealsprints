import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'massive';
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-20 w-20',
    xl: 'h-32 w-32',
    xxl: 'h-40 w-40',
    massive: 'h-48 w-48'
  };

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 80,
    xl: 128,
    xxl: 160,
    massive: 192
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/dealsprintlogo1.png"  // <-- Updated to your newest logo!
        alt="DealSprints Logo"
        width={dimensions[size]}
        height={dimensions[size]}
        className={sizeClasses[size]}
        priority
        unoptimized={false}
      />
      {showText && (
        <span className="text-2xl font-bold text-white ml-3">DealSprints</span>
      )}
    </div>
  );
}
