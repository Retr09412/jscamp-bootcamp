FROM node:24-alpine

WORKDIR /app

# Es redundante hacer esto, podemos copiar directamente lo que necesitemos
# COPY package*.json .
# COPY package-lock.json .
COPY package.json package-lock.json ./

RUN npm ci 

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]