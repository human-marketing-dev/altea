/** Primary interactive control for CTAs, forms and navigation actions.
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual treatment. @default "primary" */
  variant?: 'primary' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
