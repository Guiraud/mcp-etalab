# Guide d'utilisation - MCP Etalab avec Claude Desktop

## 🎯 Configuration pour Claude Desktop

### 1. Localiser le fichier de configuration

Sur macOS, le fichier de configuration de Claude Desktop se trouve à :
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 2. Ajouter le serveur MCP Etalab

Ouvrez le fichier `claude_desktop_config.json` et ajoutez la configuration suivante :

```json
{
  "mcpServers": {
    "mcp-etalab": {
      "command": "node",
      "args": ["/Chemin/vers/mcp-etalab/dist/index.js"],
      "env": {}
    }
  }
}
```

**Important**: Assurez-vous que le chemin `/chemin/vers/MCPs/mcp-etalab/dist/index.js` est correct et que le projet a été compilé avec `npm run build`.

### 3. Redémarrer Claude Desktop

Fermez complètement Claude Desktop et relancez-le pour que la configuration soit prise en compte.

## 🛠️ Outils disponibles

Une fois configuré, vous aurez accès aux outils suivants dans Claude Desktop :

### `search_datasets`
Rechercher des jeux de données sur data.gouv.fr
- **q**: Terme de recherche (optionnel)
- **organization**: ID de l'organisation pour filtrer (optionnel)  
- **tag**: Tag pour filtrer les résultats (optionnel)
- **format**: Format des ressources (CSV, JSON, XML, etc.) (optionnel)
- **page**: Numéro de page (défaut: 1)
- **page_size**: Nombre de résultats par page (défaut: 20, max: 100)

### `get_dataset`
Obtenir les détails complets d'un jeu de données
- **id**: Identifiant unique du dataset (requis)

### `list_organizations`
Lister les organisations sur data.gouv.fr
- **q**: Terme de recherche pour filtrer les organisations (optionnel)
- **page**: Numéro de page (défaut: 1)
- **page_size**: Nombre de résultats par page (défaut: 20, max: 100)

### `get_organization`
Obtenir les détails d'une organisation
- **id**: Identifiant unique de l'organisation (requis)

## 💡 Exemples d'utilisation

Voici quelques exemples de requêtes que vous pouvez faire à Claude une fois le serveur MCP configuré :

### Recherche simple
```
"Recherche des datasets sur les transports en commun"
```

### Recherche ciblée
```
"Trouve-moi les jeux de données CSV publiés par l'INSEE"
```

### Exploration d'une organisation
```
"Montre-moi les informations sur l'organisation INSEE et liste ses 5 premiers datasets"
```

### Analyse détaillée
```
"Peux-tu analyser le dataset avec l'ID 'xxx' et me dire quelles sont ses ressources disponibles ?"
```

## 🔧 Dépannage

### Le serveur ne démarre pas
1. Vérifiez que Node.js est installé : `node --version`
2. Vérifiez que le projet est compilé : `cd /chemin/vers/MCPs/mcp-etalab && npm run build`
3. Testez manuellement : `npm run dev`

### Claude Desktop ne voit pas le serveur
1. Vérifiez le chemin dans `claude_desktop_config.json`
2. Redémarrez complètement Claude Desktop
3. Vérifiez les logs de Claude Desktop (si disponibles)

### Erreurs lors des requêtes
1. Vérifiez votre connexion internet
2. L'API data.gouv.fr peut parfois être lente - réessayez
3. Certains datasets peuvent avoir des données incomplètes

## 📚 Ressources

- **Projet GitLab**: https://gitlab.com/mehdi_guiraud/mcp-etalab.git
- **API data.gouv.fr**: https://guides.data.gouv.fr/guide-data.gouv.fr/readme-1/tutoriel-dutilisation
- **Documentation MCP**: https://modelcontextprotocol.io/

Bon usage ! 🚀
