FROM node:20

ENV NODE_ENV=production
ENV WORKSPACE=/workspace

VOLUME /workspace

WORKDIR /app
COPY package*.json /app/

RUN npm pkg delete scripts.prepare && \
    npm ci --omit=dev --no-audit --only=production --verbose

COPY build ./
COPY entrypoint.sh ./

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "wait" ]
