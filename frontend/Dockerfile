# ====== Build Stage ======
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ====== Unit Test Stage ======
FROM node:18-alpine AS tester
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Run Vitest + React Testing Library
CMD ["npm", "test", "--", "--run"]

# ====== E2E Test Stage ======
FROM cypress/included:13.15.0 AS e2e
WORKDIR /app
COPY . .
RUN npm install
# Cypress will wait for frontend/backend before running tests
CMD ["npx", "cypress", "run"]

# ====== Runtime Stage ======
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
