# Container image for AWS App Runner, ECS/Fargate or any Docker host.
FROM node:22-alpine
ENV NODE_ENV=production PORT=8080 DB_FILE=/data/db.json
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY public ./public
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 8080
CMD ["node", "src/server.js"]
