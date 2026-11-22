import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
    if (ms < 1000) {
        return '< 1s';
    }

    return `${(ms / 1000).toFixed(2)}s`;
}
