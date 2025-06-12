FROM node:20-alpine
WORKDIR /usr/src/app

COPY pbooks-api/package*.json ./

RUN npm install --production

COPY pbooks-api/ .

EXPOSE 9000

CMD ["node", "src/server.js"]