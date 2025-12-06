import { Button } from '@/components/ui/button';

interface CategoryChipProps {
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

export default function CategoryChip({ label, icon, active, onClick }: CategoryChipProps) {
    return (
        <Button
            onClick={onClick}
            variant="outline"
            className={`rounded-full px-6 py-2 h-auto font-normal whitespace-nowrap transition-colors ${active
                    ? 'bg-tertiary text-tertiary-foreground border-tertiary hover:bg-tertiary hover:opacity-90'
                    : 'bg-background text-foreground border-border hover:bg-neutral hover:text-foreground'
                }`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </Button>
    );
}
