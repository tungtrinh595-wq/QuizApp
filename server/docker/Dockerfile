# Base image nhẹ
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /home/node/app

# Copy package và cài dependencies (bỏ dev)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN rm -rf tests docs *.log

RUN chown -R node:node /home/node/app

RUN npm install -g pm2

USER node

CMD ["pm2-runtime", "src/index.js"]
