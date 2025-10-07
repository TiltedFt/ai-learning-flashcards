import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  /**
   * Section heading text
   */
  title: string;

  /**
   * Optional description or subtitle
   */
  description?: string;

  /**
   * Optional action buttons or controls
   */
  actions?: ReactNode;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Heading level for semantic HTML hierarchy
   * @default 2
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;

  /**
   * Visual variant for different contexts
   * @default 'default'
   */
  variant?: 'default' | 'subtle' | 'accent';

  /**
   * Optional divider below the header
   * @default true
   */
  divider?: boolean;
}

const variantStyles = {
  default: 'text-gray-900 dark:text-gray-100',
  subtle: 'text-gray-700 dark:text-gray-300',
  accent: 'text-blue-600 dark:text-blue-400',
} as const;

/**
 * Section header component for organizing content within pages
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Recent Activity"
 *   description="Your latest quiz results and progress"
 *   actions={<Button variant="ghost">View All</Button>}
 * />
 * ```
 */
export function SectionHeader({
  title,
  description,
  actions,
  className = '',
  headingLevel = 2,
  variant = 'default',
  divider = true,
}: SectionHeaderProps) {
  const HeadingTag = `h${headingLevel}` as const;
  const textColor = variantStyles[variant];

  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1 min-w-0">
          <HeadingTag
            className={`text-lg font-semibold sm:text-xl md:text-2xl ${textColor} truncate`}
          >
            {title}
          </HeadingTag>

          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {divider && (
        <div
          className="mt-3 sm:mt-4 h-px bg-gray-200 dark:bg-gray-700"
          role="separator"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
