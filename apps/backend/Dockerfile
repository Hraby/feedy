FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env ./

RUN npm run build

CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]