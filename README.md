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

## 🔧 Configuration

Le serveur se connecte à l'API publique de data.gouv.fr. Aucune authentification n'est requise pour la plupart des opérations.

## 📚 Documentation

- [API data.gouv.fr](https://guides.data.gouv.fr/guide-data.gouv.fr/readme-1/tutoriel-dutilisation)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou une merge request.

## 📄 Licence

MIT
