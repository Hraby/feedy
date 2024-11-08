FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g ts-node-dev

CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]