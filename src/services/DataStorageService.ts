// Service de gestion des données en mémoire pour la session
interface StoredDataset {
  id: string;
  name: string;
  url: string;
  format: string;
  data: any;
  headers?: string[];
  rows?: any[];
  timestamp: Date;
  size: number;
}

export class DataStorageService {
  private datasets: Map<string, StoredDataset> = new Map();
  private maxStoredDatasets = 5; // Limite pour éviter la surcharge mémoire

  storeDataset(name: string, url: string, format: string, data: any): string {
    const id = this.generateId();
    
    // Préparer les données selon le format
    let processedData: StoredDataset = {
      id,
      name,
      url,
      format,
      data,
      timestamp: new Date(),
      size: JSON.stringify(data).length,
    };

    if (format === 'CSV') {
      const lines = data.split('\n').filter((line: string) => line.trim());
      const headers = lines[0]?.split(',').map((h: string) => h.trim());
      const rows = lines.slice(1).map((line: string) => {
        const values = line.split(',').map((v: string) => v.trim());
        return headers?.reduce((obj: any, header: string, index: number) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });
      
      processedData.headers = headers;
      processedData.rows = rows;
    } else if (format === 'JSON') {
      try {
        const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
        processedData.data = jsonData;
        if (Array.isArray(jsonData)) {
          processedData.rows = jsonData;
        }
      } catch (error) {
        throw new Error('Format JSON invalide');
      }
    }

    // Gérer la limite de stockage
    if (this.datasets.size >= this.maxStoredDatasets) {
      const oldestId = Array.from(this.datasets.entries())
        .sort(([,a], [,b]) => a.timestamp.getTime() - b.timestamp.getTime())[0][0];
      this.datasets.delete(oldestId);
    }

    this.datasets.set(id, processedData);
    return id;
  }

  getDataset(id: string): StoredDataset | undefined {
    return this.datasets.get(id);
  }

  listStoredDatasets(): Array<{id: string, name: string, format: string, size: string, timestamp: Date}> {
    return Array.from(this.datasets.values()).map(dataset => ({
      id: dataset.id,
      name: dataset.name,
      format: dataset.format,
      size: this.formatSize(dataset.size),
      timestamp: dataset.timestamp,
    }));
  }

  queryData(id: string, query: {
    columns?: string[];
    filter?: {column: string, value: any, operator?: 'equals' | 'contains' | 'gt' | 'lt'};
    limit?: number;
    sort?: {column: string, direction: 'asc' | 'desc'};
  }) {
    const dataset = this.datasets.get(id);
    if (!dataset) {
      throw new Error(`Dataset ${id} non trouvé`);
    }

    if (!dataset.rows) {
      throw new Error(`Dataset ${id} ne supporte pas les requêtes (format: ${dataset.format})`);
    }

    let result = [...dataset.rows];

    // Filtrage
    if (query.filter) {
      const { column, value, operator = 'equals' } = query.filter;
      result = result.filter(row => {
        const cellValue = row[column];
        switch (operator) {
          case 'equals':
            return cellValue == value;
          case 'contains':
            return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          case 'gt':
            return Number(cellValue) > Number(value);
          case 'lt':
            return Number(cellValue) < Number(value);
          default:
            return cellValue == value;
        }
      });
    }

    // Tri
    if (query.sort) {
      const { column, direction } = query.sort;
      result.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'desc' ? -comparison : comparison;
      });
    }

    // Limitation
    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    // Sélection de colonnes
    if (query.columns) {
      result = result.map(row => 
        query.columns!.reduce((obj: any, col: string) => {
          obj[col] = row[col];
          return obj;
        }, {})
      );
    }

    return {
      data: result,
      count: result.length,
      totalCount: dataset.rows.length,
      columns: query.columns || dataset.headers || Object.keys(dataset.rows[0] || {}),
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  }

  clearAll(): void {
    this.datasets.clear();
  }

  removeDataset(id: string): boolean {
    return this.datasets.delete(id);
  }
}
