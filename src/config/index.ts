// Configuration du serveur MCP Etalab
export const Config = {
  // Limites de téléchargement
  download: {
    maxSizeMB: 50,           // Taille maximale par défaut (MB)
    maxSizeAbsoluteMB: 200,  // Limite absolue (MB)
    timeoutMs: 60000,        // Timeout téléchargement (ms)
  },
  
  // Limites d'aperçu
  preview: {
    csvMaxLines: 500,        // Lignes CSV à afficher en aperçu
    csvSampleLines: 10,      // Lignes d'échantillon CSV
    xmlMaxLines: 50,         // Lignes XML à afficher
    textMaxLines: 100,       // Lignes texte à afficher
  },
  
  // API data.gouv.fr
  api: {
    baseUrl: 'https://data.gouv.fr/api/1',
    timeoutMs: 30000,        // Timeout requêtes API (ms)
    userAgent: 'MCP-Etalab/1.0.0',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,     // Taille de page par défaut
    maxPageSize: 100,        // Taille de page maximale
  },
} as const;

// Type pour la configuration (utile pour TypeScript)
export type ConfigType = typeof Config;
