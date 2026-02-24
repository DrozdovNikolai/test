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
  CMD node -e "const fs=require('node:fs');const enabled=['1','true','yes','on'].includes((process.env.HEALTHCHECK_ENABLED||'true').toLowerCase());if(!enabled){process.exit(0);}const runOnce=['1','true','yes','on'].includes((process.env.HEALTHCHECK_RUN_ONCE||'true').toLowerCase());const marker=process.env.HEALTHCHECK_MARKER_PATH||'/tmp/.backend-healthcheck-ok';if(runOnce&&fs.existsSync(marker)){process.exit(0);}const tls=['1','true','yes','on'].includes((process.env.TLS_ENABLED||'').toLowerCase());const mod=tls?require('node:https'):require('node:http');const req=mod.request({hostname:'127.0.0.1',port:Number(process.env.PORT||3000),path:'/api/health',method:'GET',...(tls?{rejectUnauthorized:false}:{})},res=>{const ok=Boolean(res.statusCode&&res.statusCode<400);if(ok&&runOnce){try{fs.writeFileSync(marker,new Date().toISOString());}catch{}}process.exit(ok?0:1);});req.on('error',()=>process.exit(1));req.end();"

USER node
CMD ["node", "dist/index.js"]
