FROM cypress/included:14.2.1
WORKDIR /app
COPY . .
# (Optionnel) Copier un fichier .env si nécessaire
# COPY .env .env
RUN npm install
CMD ["npm", "run", "test"]