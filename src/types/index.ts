// Types pour l'API data.gouv.fr

export interface Dataset {
  id: string;
  title: string;
  description: string;
  organization?: Organization;
  resources: Resource[];
  tags: string[];
  created_at: string;
  last_modified: string;
  frequency: string;
  spatial?: {
    zones: Array<{
      id: string;
      name: string;
    }>;
  };
  metrics?: {
    views: number;
    downloads: number;
    reuses: number;
  };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  format: string;
  mime: string;
  filesize: number;
  created_at: string;
  last_modified: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  page: string;
  logo: string;
  metrics?: {
    datasets: number;
    followers: number;
  };
}

export interface SearchResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface DataGouvApiError {
  message: string;
  status: number;
}
