ARG version=unknown

# --- Build ---
FROM node:14-alpine as build
ARG version

WORKDIR /app

# Copy dependiences
COPY . /app
RUN yarn install --frozen-lockfile
RUN yarn generate

WORKDIR /app/services/api
RUN yarn build --progress

# --- Production ---
FROM node:14-alpine
ARG version
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/services/api/dist /app/dist

COPY services/api/package.json /app
COPY yarn.lock /app

RUN yarn install --production

ENV HOST 0.0.0.0
ENV FULL_VERSION ${version}
#ENV APPINSIGHTS_INSTRUMENTATION_KEY 611ed269-3916-4e94-92a4-157ae35234f8

#ENV APOLLO_KEY service:Prod-k0fy8r:K0ONCsir8sHeS2ZGdNOZQg
#ENV APOLLO_GRAPH_VARIANT current
#ENV APOLLO_SCHEMA_REPORTING true

CMD ["node", "dist/index.js"]
