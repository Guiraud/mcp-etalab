# MCP Etalab

Serveur MCP (Model Context Protocol) pour accéder aux données ouvertes françaises via l'API de data.gouv.fr.

## 🎯 Objectif

Ce serveur MCP permet d'intégrer facilement l'accès aux données ouvertes françaises dans des applications compatibles MCP, notamment Claude Desktop.

## 🚀 Installation

```bash
npm install
npm run build
```

## 🛠️ Développement

```bash
npm run dev
```

## 📖 Outils disponibles

### 🔍 Recherche et consultation
- `search_datasets` - Rechercher des jeux de données
- `get_dataset` - Obtenir les détails d'un dataset
- `list_organizations` - Lister les organisations
- `get_organization` - Détails d'une organisation

### 📥 Téléchargement et analyse
- `download_resource` - Télécharger et analyser des données (CSV, JSON, XML, TXT)

### 💾 Gestion des données en mémoire
- `list_stored_datasets` - Lister les datasets stockés en mémoire (max 5)
- `query_stored_data` - Interroger les données avec filtres, tri et limite
- `get_stored_dataset` - Obtenir les détails d'un dataset stocké
- `remove_stored_dataset` - Supprimer un dataset de la mémoire
- `clear_stored_datasets` - Vider toute la mémoire

## 🆕 Nouvelles fonctionnalités

### Téléchargement et analyse de données
Le serveur peut télécharger directement les ressources de données et les analyser :

- **Formats supportés** : CSV, JSON, XML, TXT
- **Analyse automatique** : Détection de format, structure, colonnes
- **Aperçu intelligent** : Échantillons de données pour exploration
- **Stockage en mémoire** : Les données sont automatiquement stockées pour interrogation ultérieure

### Stockage et interrogation en mémoire
Les données téléchargées sont automatiquement stockées en mémoire (jusqu'à 5 datasets) :

- **Filtrage** : Filtrez les données par colonne avec différents opérateurs (equals, contains, gt, lt)
- **Tri** : Triez les résultats par n'importe quelle colonne (asc/desc)
- **Limite** : Limitez le nombre de résultats
- **Projection** : Sélectionnez uniquement les colonnes qui vous intéressent

### Exemples d'utilisation

#### Workflow complet
1. **Rechercher un dataset** : `"Trouve-moi des datasets sur les transports"`
2. **Obtenir les détails** : `"Montre-moi les ressources du dataset XYZ"`
3. **Télécharger les données** : `"Télécharge cette ressource CSV: [URL]"`
4. **Lister les datasets stockés** : `"Liste les datasets en mémoire"`
5. **Interroger les données** : `"Affiche les lignes où la colonne 'ville' contient 'Paris'"`

#### Exemples de requêtes avancées
```
"Filtre le dataset ABC123 pour ne garder que les lignes où le prix est supérieur à 100"

"Trie le dataset ABC123 par date de façon décroissante et limite à 20 résultats"

"Récupère uniquement les colonnes 'nom' et 'prix' du dataset ABC123"
```

## ⚙️ Configuration des limites

### Modification globale (Option A - Recommandée)

Éditez le fichier `src/config/index.ts` pour modifier les limites par défaut :

```typescript
export const Config = {
  // Limites de téléchargement
  download: {
    maxSizeMB: 100,          // Taille maximale par défaut (défaut: 50MB)
    maxSizeAbsoluteMB: 500,  // Limite absolue (défaut: 200MB)
    timeoutMs: 120000,       // Timeout téléchargement 2min (défaut: 60s)
  },
  
  // Limites d'aperçu
  preview: {
    csvMaxLines: 1000,       // Lignes CSV à afficher (défaut: 500)
    csvSampleLines: 20,      // Échantillon CSV (défaut: 10)
    xmlMaxLines: 100,        // Lignes XML (défaut: 50)
    textMaxLines: 200,       // Lignes texte (défaut: 100)
  },
  
  // API data.gouv.fr
  api: {
    timeoutMs: 60000,        // Timeout API (défaut: 30s)
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 50,     // Taille page (défaut: 20)
    maxPageSize: 200,        // Limite page (défaut: 100)
  },
}
```

### Appliquer les modifications

Après modification du fichier de configuration :

```bash
npm run build
# Redémarrer Claude Desktop
```

### Recommandations par usage

**📊 Pour l'analyse de données standard :**
- `maxSizeMB: 50-100` (équilibre performance/utilité)
- `csvMaxLines: 500-1000` (évite la surcharge)
- `timeoutMs: 60000` (1 minute)

**🔬 Pour l'analyse de gros datasets :**
- `maxSizeMB: 200-500` (selon vos besoins)
- `csvMaxLines: 2000` (plus de détails)
- `timeoutMs: 180000` (3 minutes)
- Utilisez `preview: false` dans les requêtes

**⚡ Pour des tests rapides :**
- `maxSizeMB: 20` (fichiers petits seulement)
- `csvMaxLines: 100` (aperçu rapide)
- `timeoutMs: 30000` (30 secondes)

### Configuration détaillée

Pour plus d'options de configuration, consultez le fichier [`CONFIGURATION.md`](CONFIGURATION.md).

## 🔧 Configuration

Le serveur se connecte à l'API publique de data.gouv.fr. Aucune authentification n'est requise pour la plupart des opérations.

## 📚 Documentation

- [API data.gouv.fr](https://guides.data.gouv.fr/guide-data.gouv.fr/readme-1/tutoriel-dutilisation)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Guide Claude Desktop](GUIDE_CLAUDE_DESKTOP.md)
- [Configuration avancée](CONFIGURATION.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une merge request.

## 📄 Licence

MIT
