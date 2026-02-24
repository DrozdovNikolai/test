FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ARG PUBLIC_BASE_PATH=/
ARG VITE_API_URL=/api
ENV NODE_ENV=production
ENV PUBLIC_BASE_PATH=$PUBLIC_BASE_PATH
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Basic healthcheck (uses Node 20 global fetch)
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=5 \
  CMD node -e "const on=(process.env.TLS_ENABLED||'').toLowerCase();const tls=['1','true','yes','on'].includes(on);const mod=tls?require('node:https'):require('node:http');const req=mod.request({hostname:'127.0.0.1',port:Number(process.env.PORT||3000),path:'/api/health',method:'GET',...(tls?{rejectUnauthorized:false}:{})},res=>process.exit(res.statusCode&&res.statusCode<400?0:1));req.on('error',()=>process.exit(1));req.end();"

USER node
CMD ["node", "dist/index.js"]
