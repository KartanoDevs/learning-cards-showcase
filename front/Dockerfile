# ========================================
# Etapa 1: Build (Compilación Angular)
# ========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar cache de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el código fuente completo
COPY . .

# Compilamos la aplicación Angular para producción con optimizaciones
RUN npm run build -- --configuration=production

# ========================================
# Etapa 2: Servidor Web (Nginx)
# ========================================
FROM nginx:alpine

# Etiquetas de metadatos
LABEL maintainer="Learning Cards Team"
LABEL description="Frontend Application for Learning Cards"

# Copiamos los archivos compilados desde la etapa de build
# Angular 19 con application builder genera dist/browser
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario no privilegiado para nginx
RUN addgroup -g 101 -S nginx || true && \
    adduser -S nginx -u 101 -G nginx || true

# Ajustar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Cambiar a usuario no privilegiado
USER nginx

# Exponemos el puerto 80
EXPOSE 80

# Health check para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Nginx se ejecuta automáticamente con CMD heredado de la imagen base
