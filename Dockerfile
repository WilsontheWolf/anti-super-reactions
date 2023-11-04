FROM node:18-alpine AS builder

WORKDIR /app

RUN apk update && \
    apk upgrade

COPY yarn.lock package.json ./

RUN yarn --production=true --frozen-lockfile --link-duplicates

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV="production"

RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init

COPY --chown=node:node --from=builder /app .
COPY --chown=node:node src/ src/

USER node:node

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD [ "node", "." ]