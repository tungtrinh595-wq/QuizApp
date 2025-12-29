FROM node:20-alpine

WORKDIR /home/node/app/socket

COPY . .

RUN npm install --production

CMD ["node", "src/index.js"]
