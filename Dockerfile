FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache make gcc g++ python3 && \
  npm install --ignore-scripts && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python3

COPY src ./src
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm run build

RUN adduser -D nonprivilegeduser
USER nonprivilegeduser

EXPOSE 3000

CMD ["node", "dist/main"]