import type { ReactNode } from 'react';

export interface PageContainerProps {
  /**
   * Page content
   */
  children: ReactNode;

  /**
   * Maximum width constraint
   * @default '7xl'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

  /**
   * Additional CSS classes for customization
   */
  className?: string;

  /**
   * Padding size
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg';

  /**
   * Enable centered layout
   * @default true
   */
  centered?: boolean;

  /**
   * HTML element to render as
   * @default 'div'
   */
  as?: 'div' | 'main' | 'section' | 'article';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
} as const;

const paddingClasses = {
  none: '',
  sm: 'px-3 py-3 sm:px-4 sm:py-4',
  default: 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
  lg: 'px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12',
} as const;

/**
 * Page container wrapper with consistent max-width, padding, and centering
 *
 * @example
 * ```tsx
 * <PageContainer maxWidth="5xl" padding="default">
 *   <PageHeader title="Dashboard" />
 *   <div>Content here</div>
 * </PageContainer>
 * ```
 */
export function PageContainer({
  children,
  maxWidth = '7xl',
  className = '',
  padding = 'default',
  centered = true,
  as: Component = 'div',
}: PageContainerProps) {
  const maxWidthClass = maxWidthClasses[maxWidth];
  const paddingClass = paddingClasses[padding];
  const centeredClass = centered ? 'mx-auto' : '';

  return (
    <Component
      className={`w-full ${maxWidthClass} ${paddingClass} ${centeredClass} ${className}`}
    >
      {children}
    </Component>
  );
}
