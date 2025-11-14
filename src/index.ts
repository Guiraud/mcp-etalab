#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { DataGouvService } from './services/DataGouvService.js';
import { DataStorageService } from './services/DataStorageService.js';
import { setupTools } from './tools/index.js';

class EtalabMCPServer {
  private server: Server;
  private dataGouvService: DataGouvService;
  private dataStorageService: DataStorageService;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-etalab',
        version: '1.0.0',
      }
    );

    this.dataGouvService = new DataGouvService();
    this.dataStorageService = new DataStorageService();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Liste des outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: setupTools(),
      };
    });

    // Exécution des outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_datasets':
            return await this.dataGouvService.searchDatasets(args);
          case 'get_dataset':
            return await this.dataGouvService.getDataset(args);
          case 'list_organizations':
            return await this.dataGouvService.listOrganizations(args);
          case 'get_organization':
            return await this.dataGouvService.getOrganization(args);
          case 'download_resource':
            return await this.dataGouvService.downloadResource(args, this.dataStorageService);
          case 'list_stored_datasets':
            return this.listStoredDatasets();
          case 'query_stored_data':
            return this.queryStoredData(args);
          case 'get_stored_dataset':
            return this.getStoredDataset(args);
          case 'remove_stored_dataset':
            return this.removeStoredDataset(args);
          case 'clear_stored_datasets':
            return this.clearStoredDatasets();
          default:
            throw new Error(`Outil inconnu: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            },
          ],
        };
      }
    });
  }

  private listStoredDatasets() {
    const datasets = this.dataStorageService.listStoredDatasets();

    if (datasets.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: '📦 Aucun dataset stocké en mémoire.\n\nUtilisez `download_resource` avec `store: true` pour stocker des données.',
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `📦 **Datasets stockés en mémoire** (${datasets.length}/${5})\n\n` +
                datasets.map(ds =>
                  `**ID:** ${ds.id}\n` +
                  `**Nom:** ${ds.name}\n` +
                  `**Format:** ${ds.format}\n` +
                  `**Taille:** ${ds.size}\n` +
                  `**Stocké le:** ${ds.timestamp.toLocaleString('fr-FR')}\n`
                ).join('\n---\n') +
                `\n\n💡 **Astuce:** Utilisez \`query_stored_data\` avec l'ID pour interroger les données.`,
        },
      ],
    };
  }

  private queryStoredData(args: any) {
    const id = args.id;
    if (!id) {
      throw new Error('Paramètre "id" requis');
    }

    const query = {
      columns: args.columns,
      filter: args.filter,
      limit: args.limit,
      sort: args.sort,
    };

    try {
      const result = this.dataStorageService.queryData(id, query);

      return {
        content: [
          {
            type: 'text',
            text: `📊 **Résultats de la requête**\n\n` +
                  `**Dataset ID:** ${id}\n` +
                  `**Résultats:** ${result.count} / ${result.totalCount} lignes\n` +
                  `**Colonnes:** ${result.columns.join(', ')}\n\n` +
                  `## Données\n\`\`\`json\n${JSON.stringify(result.data.slice(0, 10), null, 2)}\n\`\`\`\n\n` +
                  (result.count > 10 ? `_Affichage limité aux 10 premières lignes_\n\n` : '') +
                  `💡 **Astuce:** Utilisez les paramètres \`filter\`, \`sort\`, \`limit\` pour affiner les résultats.`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erreur lors de la requête: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private getStoredDataset(args: any) {
    const id = args.id;
    if (!id) {
      throw new Error('Paramètre "id" requis');
    }

    const dataset = this.dataStorageService.getDataset(id);
    if (!dataset) {
      throw new Error(`Dataset ${id} non trouvé en mémoire`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `📦 **Dataset: ${dataset.name}**\n\n` +
                `**ID:** ${dataset.id}\n` +
                `**Format:** ${dataset.format}\n` +
                `**URL source:** ${dataset.url}\n` +
                `**Taille:** ${this.formatSize(dataset.size)}\n` +
                `**Stocké le:** ${dataset.timestamp.toLocaleString('fr-FR')}\n` +
                (dataset.headers ? `\n**Colonnes (${dataset.headers.length}):** ${dataset.headers.join(', ')}\n` : '') +
                (dataset.rows ? `\n**Lignes:** ${dataset.rows.length}\n` : '') +
                `\n💡 **Astuce:** Utilisez \`query_stored_data\` pour interroger ces données.`,
        },
      ],
    };
  }

  private removeStoredDataset(args: any) {
    const id = args.id;
    if (!id) {
      throw new Error('Paramètre "id" requis');
    }

    const removed = this.dataStorageService.removeDataset(id);
    if (!removed) {
      throw new Error(`Dataset ${id} non trouvé`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Dataset ${id} supprimé de la mémoire.`,
        },
      ],
    };
  }

  private clearStoredDatasets() {
    this.dataStorageService.clearAll();
    return {
      content: [
        {
          type: 'text',
          text: `✅ Tous les datasets ont été supprimés de la mémoire.`,
        },
      ],
    };
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Serveur MCP Etalab démarré');
  }
}

const server = new EtalabMCPServer();
server.run().catch(console.error);
