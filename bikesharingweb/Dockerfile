FROM node:lts
ENV PORT 80
EXPOSE 80

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]