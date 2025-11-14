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
    {
      name: 'download_resource',
      description: 'Télécharger et analyser une ressource de données',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL de la ressource à télécharger',
          },
          format: {
            type: 'string',
            description: 'Format attendu (CSV, JSON, XML, etc.) - optionnel',
          },
          maxSize: {
            type: 'number',
            description: 'Taille maximale en MB (défaut: 50MB)',
            default: 50,
            minimum: 1,
            maximum: 200,
          },
          preview: {
            type: 'boolean',
            description: 'Aperçu seulement (premières lignes) - défaut: true',
            default: true,
          },
          store: {
            type: 'boolean',
            description: 'Stocker les données en mémoire pour interrogation ultérieure - défaut: true',
            default: true,
          },
          name: {
            type: 'string',
            description: 'Nom personnalisé pour le dataset (optionnel, extrait de l\'URL par défaut)',
          },
        },
        required: ['url'],
      },
    },
    {
      name: 'list_stored_datasets',
      description: 'Lister tous les datasets stockés en mémoire',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'query_stored_data',
      description: 'Interroger un dataset stocké en mémoire avec filtres, tri et limite',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID du dataset stocké',
          },
          columns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Colonnes à récupérer (optionnel, toutes par défaut)',
          },
          filter: {
            type: 'object',
            properties: {
              column: {
                type: 'string',
                description: 'Nom de la colonne à filtrer',
              },
              value: {
                description: 'Valeur à rechercher',
              },
              operator: {
                type: 'string',
                enum: ['equals', 'contains', 'gt', 'lt'],
                description: 'Opérateur de comparaison (défaut: equals)',
              },
            },
            required: ['column', 'value'],
            description: 'Filtre à appliquer (optionnel)',
          },
          sort: {
            type: 'object',
            properties: {
              column: {
                type: 'string',
                description: 'Colonne pour le tri',
              },
              direction: {
                type: 'string',
                enum: ['asc', 'desc'],
                description: 'Direction du tri',
              },
            },
            required: ['column', 'direction'],
            description: 'Tri à appliquer (optionnel)',
          },
          limit: {
            type: 'number',
            description: 'Nombre maximum de résultats (optionnel)',
            minimum: 1,
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'get_stored_dataset',
      description: 'Obtenir les détails d\'un dataset stocké en mémoire',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID du dataset stocké',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'remove_stored_dataset',
      description: 'Supprimer un dataset de la mémoire',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID du dataset à supprimer',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'clear_stored_datasets',
      description: 'Supprimer tous les datasets stockés en mémoire',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}
