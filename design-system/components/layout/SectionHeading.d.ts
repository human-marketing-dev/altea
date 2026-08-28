/** Eyebrow + heading + optional description, the standard section opener.
 */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'ink' | 'light';
}
