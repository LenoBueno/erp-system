import { Button as ButtonPrimitive } from '@radix-ui/react-button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps {
  children: React.ReactNode;
  ariaLabel?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AccessibleButton({
  children,
  ariaLabel,
  variant = 'default',
  className,
  onClick,
  disabled,
}: AccessibleButtonProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  return (
    <ButtonPrimitive
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </ButtonPrimitive>
  );
}
