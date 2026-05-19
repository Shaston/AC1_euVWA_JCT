FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN rm -rf node_modules \
    && npm_config_build_from_source=true npm ci --omit=dev \
    && mkdir -p data uploads uploads_safe \
    && groupadd -r appuser \
    && useradd --no-log-init -r -g appuser appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["node", "app.js"]
