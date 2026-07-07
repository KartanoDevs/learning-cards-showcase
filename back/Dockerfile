# ========================================
# Etapa 1: Build (Compilación TypeScript)
# ========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar cache de Docker
COPY package*.json ./

# Instalamos dependencias (incluyendo devDependencies para compilar TypeScript)
RUN npm ci --only=production=false

# Copiamos el código fuente
COPY . .

# Compilamos TypeScript a JavaScript
RUN npm run build

# ========================================
# Etapa 2: Producción (Imagen optimizada)
# ========================================
FROM node:22-alpine

# Etiquetas de metadatos
LABEL maintainer="Learning Cards Team"
LABEL description="Backend API for Learning Cards Application"

WORKDIR /app

# Crear usuario no privilegiado para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos SOLO dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiamos los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Cambiamos ownership de los archivos al usuario no privilegiado
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no privilegiado
USER nodejs

# Exponemos el puerto de la aplicación
EXPOSE 4000

# Health check para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Variables de entorno de producción
ENV NODE_ENV=production

# Comando de inicio
CMD ["npm", "start"]
