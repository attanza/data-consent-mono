FROM node:18-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR "/usr/src/app"
COPY package*.json ./
RUN npm install --only=prod
COPY . .
CMD ["node", "src/server"]