/** Large number + uppercase label, for headline metrics (occupancy, hectares, visitors/month).
 */
export interface StatBlockProps {
  value: string;
  label: string;
  tone?: 'ink' | 'light';
}
