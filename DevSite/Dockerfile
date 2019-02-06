FROM node:lts
EXPOSE 80

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ENTRYPOINT ["node", "server.js"]
