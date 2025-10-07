import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /**
   * Main heading text
   */
  title: string;

  /**
   * Optional description or subtitle
   */
  description?: string;

  /**
   * Optional action buttons (e.g., "Create New", "Settings")
   */
  actions?: ReactNode;

  /**
   * Optional breadcrumb or navigation element
   */
  breadcrumb?: ReactNode;

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Heading level for semantic HTML and accessibility
   * @default 1
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Unified page header component with consistent styling and accessibility
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Quiz Collections"
 *   description="Manage and organize your learning materials"
 *   actions={<Button>Create New</Button>}
 *   breadcrumb={<Breadcrumb items={[...]} />}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className = '',
  headingLevel = 1,
}: PageHeaderProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <header
      className={`mb-6 sm:mb-8 ${className}`}
      role="banner"
      aria-label="Page header"
    >
      {breadcrumb && (
        <nav className="mb-3 sm:mb-4" aria-label="Breadcrumb">
          {breadcrumb}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex-1 min-w-0">
          <HeadingTag className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl truncate">
            {title}
          </HeadingTag>

          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base max-w-3xl">
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
    </header>
  );
}
