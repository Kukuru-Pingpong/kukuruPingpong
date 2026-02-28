FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json apps/server/
COPY tsconfig.base.json ./
RUN pnpm install --frozen-lockfile --filter server
COPY apps/server apps/server
RUN pnpm --filter server build
RUN pnpm --filter server deploy --legacy /app/deploy

FROM base AS runner
WORKDIR /app
COPY --from=build /app/deploy/node_modules ./node_modules
COPY --from=build /app/deploy/package.json ./
COPY --from=build /app/apps/server/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main"]
