# base node image
FROM node:18-slim as base
ARG PNPM_VERSION=8.6.1

# Install openssl for Prisma
RUN apt-get update \
  && apt-get install --no-install-recommends -y openssl procps vim-tiny sqlite3 ca-certificates fuse3 \
  && apt-get clean \
  && npm i -g pnpm@${PNPM_VERSION} \
  && rm -rf /var/lib/apt/lists/*


# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch

# Setup production node_modules
FROM base as production-deps

ENV NODE_ENV "production"
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --offline --frozen-lockfile --prod


# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --offline --frozen-lockfile

COPY prisma .
RUN pnpm exec prisma generate

COPY . .
RUN pnpm run build


# Run the app
FROM base

ENV FLY="true"
ENV LITEFS_DIR="/litefs"
ENV DATABASE_FILENAME="data.db"
ENV DATABASE_PATH="$LITEFS_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
ENV INTERNAL_PORT="8080"
ENV PORT="3000"
ENV NODE_ENV="production"

WORKDIR /app

COPY --from=production-deps /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/tsconfig.json /app/tsconfig.json
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/start.sh /app/start.sh

# prepare for litefs
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
COPY litefs.yml /etc/litefs.yml

CMD ["litefs", "mount"]
