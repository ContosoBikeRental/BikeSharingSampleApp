# boron is the current LTS version
FROM node

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY /app/package.json /app/
RUN npm install

# Bundle app source
COPY /app /app

# Bind to port 80
EXPOSE 80

# run node server.js
CMD ["npm", "start"]
