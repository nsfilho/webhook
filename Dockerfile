FROM alpine:3.18.5

RUN apk add --no-cache nodejs npm docker bash

ENV NODE_ENV=production
ENV WORKSPACE=/workspace

VOLUME /workspace

WORKDIR /app
COPY package*.json /app/

RUN npm pkg delete scripts.prepare && \
    npm ci --omit=dev --no-audit --only=production --verbose

COPY build /app/
COPY entrypoint.sh /app/

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "wait" ]
