import { Input as InputPrimitive } from '@radix-ui/react-input';
import { cn } from '@/lib/utils';

interface AccessibleInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

export function AccessibleInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
  disabled,
  type = 'text',
}: AccessibleInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <InputPrimitive
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        disabled={disabled}
        type={type}
        aria-label={label}
        aria-disabled={disabled}
      />
    </div>
  );
}
