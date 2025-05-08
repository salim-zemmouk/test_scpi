#!/bin/bash

# Installer les dépendances (si ce n'est pas déjà fait)
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Fusionner tous les fichiers JSON générés par Cypress
npx mochawesome-merge cypress/reports/html/jsons/*.json > cypress/reports/html/mochawesome.json

# Générer un rapport HTML à partir du JSON fusionné
npx marge cypress/reports/html/mochawesome.json --reportDir cypress/reports/html --reportFilename index
