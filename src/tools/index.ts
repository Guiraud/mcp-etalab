import { Tool } from '@modelcontextprotocol/sdk/types.js';

export function setupTools(): Tool[] {
  return [
    {
      name: 'search_datasets',
      description: 'Rechercher des jeux de données sur data.gouv.fr',
      inputSchema: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Terme de recherche (optionnel)',
          },
          organization: {
            type: 'string',
            description: 'ID de l\'organisation pour filtrer (optionnel)',
          },
          tag: {
            type: 'string',
            description: 'Tag pour filtrer les résultats (optionnel)',
          },
          format: {
            type: 'string',
            description: 'Format des ressources (CSV, JSON, XML, etc.) (optionnel)',
          },
          page: {
            type: 'number',
            description: 'Numéro de page (défaut: 1)',
            minimum: 1,
          },
          page_size: {
            type: 'number',
            description: 'Nombre de résultats par page (défaut: 20, max: 100)',
            minimum: 1,
            maximum: 100,
          },
        },
      },
    },
    {
      name: 'get_dataset',
      description: 'Obtenir les détails complets d\'un jeu de données',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Identifiant unique du dataset',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'list_organizations',
      description: 'Lister les organisations sur data.gouv.fr',
      inputSchema: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'Terme de recherche pour filtrer les organisations (optionnel)',
          },
          page: {
            type: 'number',
            description: 'Numéro de page (défaut: 1)',
            minimum: 1,
          },
          page_size: {
            type: 'number',
            description: 'Nombre de résultats par page (défaut: 20, max: 100)',
            minimum: 1,
            maximum: 100,
          },
        },
      },
    },
    {
      name: 'get_organization',
      description: 'Obtenir les détails d\'une organisation',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Identifiant unique de l\'organisation',
          },
        },
        required: ['id'],
      },
    },
  ];
}
