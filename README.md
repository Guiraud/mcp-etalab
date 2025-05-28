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

- `search_datasets` - Rechercher des jeux de données
- `get_dataset` - Obtenir les détails d'un dataset
- `list_organizations` - Lister les organisations
- `get_organization` - Détails d'une organisation
- `download_resource` - **NOUVEAU** Télécharger et analyser des données (CSV, JSON, XML)

## 🆕 Nouvelles fonctionnalités

### Téléchargement et analyse de données
Le serveur peut maintenant télécharger directement les ressources de données et les analyser :

- **Formats supportés** : CSV, JSON, XML, TXT
- **Analyse automatique** : Détection de format, structure, colonnes
- **Aperçu intelligent** : Échantillons de données pour exploration
- **Utilisation dans la conversation** : Les données téléchargées sont analysables par Claude

### Exemple d'utilisation

1. **Rechercher un dataset** : `"Trouve-moi des datasets sur les transports"`
2. **Obtenir les détails** : `"Montre-moi les ressources du dataset XYZ"`
3. **Télécharger les données** : `"Télécharge cette ressource CSV: [URL]"`
4. **Analyser** : `"Peux-tu analyser ces données et me faire un résumé ?"`

## 🔧 Configuration

Le serveur se connecte à l'API publique de data.gouv.fr. Aucune authentification n'est requise pour la plupart des opérations.

## 📚 Documentation

- [API data.gouv.fr](https://guides.data.gouv.fr/guide-data.gouv.fr/readme-1/tutoriel-dutilisation)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une merge request.

## 📄 Licence

MIT
