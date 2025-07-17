FROM node:20-alpine
WORKDIR /usr/src/app

COPY pbooks-api/package*.json ./

RUN npm install --production

COPY pbooks-api/ .

# Créer les dossiers d'upload nécessaires avec les bonnes permissions
RUN mkdir -p public/uploads/temp public/uploads/avatars public/uploads/medias && \
    chmod -R 755 public/uploads

EXPOSE 9000

CMD ["node", "src/server.js"]