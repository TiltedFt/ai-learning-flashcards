import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /**
   * Optional icon or illustration
   */
  icon?: ReactNode;

  /**
   * Main heading text
   */
  title: string;

  /**
   * Optional description or help text
   */
  description?: string;

  /**
   * Optional primary action (e.g., "Create First Item")
   */
  action?: ReactNode;

  /**
   * Optional secondary action or link
   */
  secondaryAction?: ReactNode;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Visual variant for different contexts
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'detailed';
}

const variantStyles = {
  default: {
    container: 'py-12 px-4',
    icon: 'text-5xl mb-4',
    title: 'text-xl font-semibold',
    description: 'text-base mt-2',
  },
  compact: {
    container: 'py-8 px-4',
    icon: 'text-4xl mb-3',
    title: 'text-lg font-medium',
    description: 'text-sm mt-1',
  },
  detailed: {
    container: 'py-16 px-4',
    icon: 'text-6xl mb-5',
    title: 'text-2xl font-bold',
    description: 'text-lg mt-3',
  },
} as const;

/**
 * Reusable empty state component for lists, searches, and empty views
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<FolderIcon className="w-16 h-16" />}
 *   title="No collections yet"
 *   description="Create your first collection to start organizing flashcards"
 *   action={<Button>Create Collection</Button>}
 *   secondaryAction={<Link href="/help">Learn more</Link>}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  variant = 'default',
}: EmptyStateProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${styles.container} ${className}`}
      role="status"
      aria-label="Empty state"
    >
      {icon && (
        <div
          className={`text-gray-400 dark:text-gray-600 ${styles.icon}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h3 className={`text-gray-900 dark:text-gray-100 ${styles.title}`}>
        {title}
      </h3>

      {description && (
        <p className={`text-gray-600 dark:text-gray-400 ${styles.description} max-w-md`}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          {action && <div>{action}</div>}
          {secondaryAction && <div>{secondaryAction}</div>}
        </div>
      )}
    </div>
  );
}
