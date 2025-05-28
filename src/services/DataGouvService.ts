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
        `- **${r.title}** (${r.format}) - ${r.filesize ? `${Math.round(r.filesize / 1024)} Ko` : 'Taille inconnue'}\n  ${r.url}`
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
                  `- Réutilisations: ${dataset.metrics?.reuses || 0}`,
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
}
