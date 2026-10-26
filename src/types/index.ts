export interface Project {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  area: string;
  image: string;
  materials: string[];
  description: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  deliverables: string[];
  description: string;
}

export interface ArchitecturalAnnotation {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  details: string[];
  range: [number, number]; // progress range [min, max]
  axisValue: string;
  highlightCoordinates: { x: number; y: number };
}
