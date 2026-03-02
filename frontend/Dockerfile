# Dockerfile for Next.js Frontend
FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# In dev mode, we use next dev
CMD ["npm", "run", "dev", "--", "-p", "3000"]
