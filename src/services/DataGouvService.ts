import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import type { Dataset, Organization, SearchResponse } from '../types/index.js';

// Schémas de validation Zod
const SearchDatasetsSchema = z.object({
  q: z.string().optional().describe('Terme de recherche'),
  organization: z.string().optional().describe('ID de l\'organisation'),
  tag: z.string().optional().describe('Tag à filtrer'),
  format: z.string().optional().describe('Format des ressources'),
  page: z.number().min(1).default(1).describe('Numéro de page'),
  page_size: z.number().min(1).max(100).default(20).describe('Taille de page'),
});

const GetDatasetSchema = z.object({
  id: z.string().describe('ID du dataset'),
});

const ListOrganizationsSchema = z.object({
  q: z.string().optional().describe('Terme de recherche'),
  page: z.number().min(1).default(1).describe('Numéro de page'),
  page_size: z.number().min(1).max(100).default(20).describe('Taille de page'),
});

const GetOrganizationSchema = z.object({
  id: z.string().describe('ID de l\'organisation'),
});

const DownloadResourceSchema = z.object({
  url: z.string().describe('URL de la ressource à télécharger'),
  format: z.string().optional().describe('Format attendu (CSV, JSON, XML, etc.)'),
  maxSize: z.number().default(10).describe('Taille maximale en MB (défaut: 10MB)'),
  preview: z.boolean().default(true).describe('Aperçu seulement (100 premières lignes)'),
});

export class DataGouvService {
  private client: AxiosInstance;
  private baseUrl = 'https://data.gouv.fr/api/1';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'User-Agent': 'MCP-Etalab/1.0.0',
        'Accept': 'application/json',
      },
    });
  }

  async searchDatasets(args: unknown) {
    const params = SearchDatasetsSchema.parse(args);
    
    try {
      const response = await this.client.get<SearchResponse<Dataset>>('/datasets/', {
        params,
      });

      const datasets = response.data.data.map(dataset => ({
        id: dataset.id,
        title: dataset.title,
        description: dataset.description?.substring(0, 200) + '...',
        organization: dataset.organization?.name,
        resources_count: dataset.resources?.length || 0,
        tags: dataset.tags?.slice(0, 5),
        last_modified: dataset.last_modified,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `Trouvé ${response.data.total} dataset(s) (page ${params.page}/${Math.ceil(response.data.total / params.page_size)}):\n\n` +
                  datasets.map(d => 
                    `**${d.title}**\n` +
                    `ID: ${d.id}\n` +
                    `Organisation: ${d.organization || 'Non spécifiée'}\n` +
                    `Ressources: ${d.resources_count}\n` +
                    `Tags: ${d.tags?.join(', ') || 'Aucun'}\n` +
                    `Description: ${d.description}\n`
                  ).join('\n---\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async getDataset(args: unknown) {
    const { id } = GetDatasetSchema.parse(args);
    
    try {
      const response = await this.client.get<Dataset>(`/datasets/${id}/`);
      const dataset = response.data;

      const resources = dataset.resources?.slice(0, 10).map(r => 
        `- **${r.title}** (${r.format}) - ${r.filesize ? `${Math.round(r.filesize / 1024)} Ko` : 'Taille inconnue'}\n  URL: ${r.url}`
      ).join('\n') || 'Aucune ressource';

      return {
        content: [
          {
            type: 'text',
            text: `# ${dataset.title}\n\n` +
                  `**ID:** ${dataset.id}\n` +
                  `**Organisation:** ${dataset.organization?.name || 'Non spécifiée'}\n` +
                  `**Créé le:** ${new Date(dataset.created_at).toLocaleDateString('fr-FR')}\n` +
                  `**Modifié le:** ${new Date(dataset.last_modified).toLocaleDateString('fr-FR')}\n` +
                  `**Fréquence:** ${dataset.frequency || 'Non spécifiée'}\n` +
                  `**Tags:** ${dataset.tags?.join(', ') || 'Aucun'}\n\n` +
                  `## Description\n${dataset.description}\n\n` +
                  `## Ressources (${dataset.resources?.length || 0})\n${resources}\n\n` +
                  `## Métriques\n` +
                  `- Vues: ${dataset.metrics?.views || 0}\n` +
                  `- Téléchargements: ${dataset.metrics?.downloads || 0}\n` +
                  `- Réutilisations: ${dataset.metrics?.reuses || 0}\n\n` +
                  `💡 **Conseil:** Copiez l'URL d'une ressource pour la télécharger avec "download_resource"`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du dataset: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async listOrganizations(args: unknown) {
    const params = ListOrganizationsSchema.parse(args);
    
    try {
      const response = await this.client.get<SearchResponse<Organization>>('/organizations/', {
        params,
      });

      const organizations = response.data.data.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description?.substring(0, 150) + '...',
        datasets_count: org.metrics?.datasets || 0,
        followers: org.metrics?.followers || 0,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `Trouvé ${response.data.total} organisation(s) (page ${params.page}):\n\n` +
                  organizations.map(org => 
                    `**${org.name}**\n` +
                    `ID: ${org.id}\n` +
                    `Datasets: ${org.datasets_count}\n` +
                    `Followers: ${org.followers}\n` +
                    `Description: ${org.description}\n`
                  ).join('\n---\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des organisations: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async getOrganization(args: unknown) {
    const { id } = GetOrganizationSchema.parse(args);
    
    try {
      const response = await this.client.get<Organization>(`/organizations/${id}/`);
      const org = response.data;

      return {
        content: [
          {
            type: 'text',
            text: `# ${org.name}\n\n` +
                  `**ID:** ${org.id}\n` +
                  `**Page:** ${org.page}\n` +
                  `**Datasets:** ${org.metrics?.datasets || 0}\n` +
                  `**Followers:** ${org.metrics?.followers || 0}\n\n` +
                  `## Description\n${org.description}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'organisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  async downloadResource(args: unknown) {
    const { url, format, maxSize, preview } = DownloadResourceSchema.parse(args);
    
    try {
      // Vérifier la taille du fichier d'abord
      const headResponse = await this.client.head(url);
      const contentLength = headResponse.headers['content-length'];
      
      if (contentLength) {
        const sizeMB = parseInt(contentLength) / (1024 * 1024);
        if (sizeMB > maxSize) {
          throw new Error(`Fichier trop volumineux: ${sizeMB.toFixed(2)}MB (limite: ${maxSize}MB)`);
        }
      }

      // Télécharger le contenu
      const response = await this.client.get(url, {
        responseType: 'text',
        timeout: 30000,
      });

      const data = response.data;
      const detectedFormat = this.detectFormat(url, response.headers['content-type']);
      
      // Traitement selon le format
      if (detectedFormat === 'CSV') {
        return this.processCSVData(data, preview);
      } else if (detectedFormat === 'JSON') {
        return this.processJSONData(data, preview);
      } else if (detectedFormat === 'XML') {
        return this.processXMLData(data, preview);
      } else {
        return this.processTextData(data, preview, detectedFormat);
      }

    } catch (error: any) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error(`Impossible d'accéder à la ressource: ${url}`);
      }
      throw new Error(`Erreur lors du téléchargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private detectFormat(url: string, contentType?: string): string {
    // Détecter le format depuis l'URL
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.csv')) return 'CSV';
    if (urlLower.includes('.json')) return 'JSON';
    if (urlLower.includes('.xml')) return 'XML';
    if (urlLower.includes('.txt')) return 'TXT';
    
    // Détecter depuis le Content-Type
    if (contentType) {
      if (contentType.includes('csv')) return 'CSV';
      if (contentType.includes('json')) return 'JSON';
      if (contentType.includes('xml')) return 'XML';
    }
    
    return 'UNKNOWN';
  }

  private processCSVData(data: string, preview: boolean) {
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0];
    const dataLines = lines.slice(1);
    
    const displayLines = preview ? dataLines.slice(0, 100) : dataLines;
    const sample = displayLines.slice(0, 5);
    
    return {
      content: [
        {
          type: 'text',
          text: `# Données CSV téléchargées\n\n` +
                `**Format:** CSV\n` +
                `**Nombre de lignes:** ${dataLines.length}\n` +
                `**Colonnes:** ${headers.split(',').length}\n` +
                `**Aperçu:** ${preview ? 'Oui (100 premières lignes)' : 'Complet'}\n\n` +
                `## En-têtes\n\`\`\`\n${headers}\n\`\`\`\n\n` +
                `## Échantillon (5 premières lignes)\n\`\`\`csv\n${headers}\n${sample.join('\n')}\n\`\`\`\n\n` +
                `## Analyse\n` +
                `- **Colonnes détectées:** ${headers.split(',').map(h => h.trim()).join(', ')}\n` +
                `- **Lignes disponibles:** ${displayLines.length}${preview && dataLines.length > 100 ? ' (tronqué)' : ''}\n` +
                `- **Utilisable pour:** Analyse de données, visualisations, statistiques\n\n` +
                `💡 **Conseil:** Vous pouvez maintenant me demander d'analyser ces données, créer des graphiques, ou calculer des statistiques !`,
        },
      ],
    };
  }

  private processJSONData(data: string, preview: boolean) {
    try {
      const jsonData = JSON.parse(data);
      const isArray = Array.isArray(jsonData);
      const sample = isArray ? jsonData.slice(0, 3) : jsonData;
      
      return {
        content: [
          {
            type: 'text',
            text: `# Données JSON téléchargées\n\n` +
                  `**Format:** JSON\n` +
                  `**Type:** ${isArray ? `Array (${jsonData.length} éléments)` : 'Object'}\n` +
                  `**Aperçu:** ${preview ? 'Oui (structure seulement)' : 'Complet'}\n\n` +
                  `## Structure\n\`\`\`json\n${JSON.stringify(sample, null, 2)}\n\`\`\`\n\n` +
                  `## Analyse\n` +
                  `- **Éléments:** ${isArray ? jsonData.length : 'Objet unique'}\n` +
                  `- **Utilisable pour:** Analyse de données structurées, extraction d'informations\n\n` +
                  `💡 **Conseil:** Je peux analyser ces données JSON et extraire des informations spécifiques !`,
          },
        ],
      };
    } catch (error) {
      throw new Error('Format JSON invalide');
    }
  }

  private processXMLData(data: string, preview: boolean) {
    const lines = data.split('\n');
    const displayLines = preview ? lines.slice(0, 50) : lines;
    
    return {
      content: [
        {
          type: 'text',
          text: `# Données XML téléchargées\n\n` +
                `**Format:** XML\n` +
                `**Lignes:** ${lines.length}\n` +
                `**Aperçu:** ${preview ? 'Oui (50 premières lignes)' : 'Complet'}\n\n` +
                `## Contenu\n\`\`\`xml\n${displayLines.join('\n')}\n\`\`\`\n\n` +
                `💡 **Conseil:** Je peux parser ce XML et extraire des données spécifiques !`,
        },
      ],
    };
  }

  private processTextData(data: string, preview: boolean, format: string) {
    const lines = data.split('\n');
    const displayLines = preview ? lines.slice(0, 100) : lines;
    
    return {
      content: [
        {
          type: 'text',
          text: `# Données téléchargées\n\n` +
                `**Format:** ${format}\n` +
                `**Lignes:** ${lines.length}\n` +
                `**Aperçu:** ${preview ? 'Oui (100 premières lignes)' : 'Complet'}\n\n` +
                `## Contenu\n\`\`\`\n${displayLines.join('\n')}\n\`\`\`\n\n` +
                `💡 **Conseil:** Ces données sont maintenant disponibles pour analyse !`,
        },
      ],
    };
  }
}
