#!/bin/bash

echo "📦 Génération des rapports HTML avec mochawesome..."

if ls cypress/reports/html/*.json 1> /dev/null 2>&1; then
  npx mochawesome-merge cypress/reports/html/*.json > cypress/reports/html/output.json
  npx marge cypress/reports/html/output.json -f index -o cypress/reports/html
  echo "✅ Rapport généré dans cypress/reports/html/index.html"
else
  echo "❌ Aucun fichier JSON trouvé dans cypress/reports/html"
fi