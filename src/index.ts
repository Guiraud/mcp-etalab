#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { DataGouvService } from './services/DataGouvService.js';
import { setupTools } from './tools/index.js';

class EtalabMCPServer {
  private server: Server;
  private dataGouvService: DataGouvService;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-etalab',
        version: '1.0.0',
      }
    );

    this.dataGouvService = new DataGouvService();
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
            return await this.dataGouvService.downloadResource(args);
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Serveur MCP Etalab démarré');
  }
}

const server = new EtalabMCPServer();
server.run().catch(console.error);
