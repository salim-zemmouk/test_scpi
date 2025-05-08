if ls cypress/reports/html/*.json 1> /dev/null 2>&1; then
    npx mochawesome-merge cypress/reports/html/*.json > cypress/reports/html/output.json
    npx marge cypress/reports/html/output.json -f index -o cypress/reports/html
else
    echo '❗ Aucun rapport JSON trouvé dans cypress/reports/html'
fi