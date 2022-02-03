FROM node:17

WORKDIR /app

COPY package*.json ./
COPY ./ ./

RUN npm install

USER node

CMD ["node" , "index.js"]