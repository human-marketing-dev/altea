/** Real-estate project preview card: image, unit tag, title, location and an optional stat line.
 */
export interface ProjectCardProps {
  image: string;
  unit: string;
  title: string;
  location: string;
  stat?: string;
}
