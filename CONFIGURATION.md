# Configuration des limites - MCP Etalab

## 🔧 Modifier les limites de données

### 1. **Taille maximale des fichiers**

#### Option A : Modification par défaut
Éditez le fichier `src/config/index.ts` :

```typescript
export const Config = {
  download: {
    maxSizeMB: 100,          // Changez ici (défaut: 50MB)
    maxSizeAbsoluteMB: 500,  // Limite absolue (défaut: 200MB)
    timeoutMs: 120000,       // Timeout 2 minutes (défaut: 60s)
  },
  // ...
}
```

#### Option B : Modification à l'utilisation
L'utilisateur peut spécifier la limite lors de l'appel :
```json
{
  "name": "download_resource",
  "arguments": {
    "url": "https://example.com/data.csv",
    "maxSize": 100
  }
}
```

### 2. **Nombre de lignes d'aperçu**

Dans `src/config/index.ts` :
```typescript
preview: {
  csvMaxLines: 1000,      // Lignes CSV (défaut: 500)
  csvSampleLines: 20,     // Échantillon (défaut: 10)
  xmlMaxLines: 100,       // XML (défaut: 50)
  textMaxLines: 200,      // Texte (défaut: 100)
},
```

### 3. **Timeout des requêtes**

```typescript
api: {
  timeoutMs: 60000,       // API data.gouv.fr (défaut: 30s)
},
download: {
  timeoutMs: 180000,      // Téléchargements (défaut: 60s)
}
```

### 4. **Pagination**

```typescript
pagination: {
  defaultPageSize: 50,    // Défaut: 20
  maxPageSize: 200,       // Défaut: 100
},
```

## 🚀 **Appliquer les modifications**

Après modification des fichiers :

```bash
cd /Users/mguiraud/Documents/MCPs/mcp-etalab
npm run build
```

Puis redémarrez Claude Desktop.

## 💡 **Recommandations**

### Limites raisonnables :
- **Fichiers** : 50-100MB (équilibre performance/utilité)
- **Timeout** : 60-120s (selon votre connexion)
- **Aperçu CSV** : 500-1000 lignes (évite la surcharge)

### Pour gros datasets :
- Utilisez `preview: false` pour voir tout
- Augmentez `maxSize` selon vos besoins
- Considérez le découpage en plusieurs requêtes

### Surveillance :
- Surveillez la mémoire de Claude Desktop
- Les gros fichiers peuvent ralentir l'interface
- Préférez l'analyse par chunks pour >50MB

## 🔍 **Variables d'environnement (optionnel)**

Vous pouvez aussi créer un fichier `.env` :
```bash
MCP_ETALAB_MAX_SIZE=100
MCP_ETALAB_TIMEOUT=120000
MCP_ETALAB_PREVIEW_LINES=1000
```

Puis les lire dans le code pour une configuration dynamique.
