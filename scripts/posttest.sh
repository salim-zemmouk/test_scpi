#!/bin/bash

# Fusionner les fichiers JSON générés
npx mochawesome-merge cypress/reports/html/jsons/*.json > cypress/reports/html/mochawesome.json

# Générer le rapport HTML final
npx marge cypress/reports/html/mochawesome.json \
  --reportDir cypress/reports/html \
  --reportFilename index