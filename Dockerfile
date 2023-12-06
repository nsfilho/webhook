FROM node:20

ENV NODE_ENV=production

WORKDIR /app
COPY package*.json /app/

RUN npm set-script prepare "" && \
    npm ci --omit=dev --no-audit --only=production --verbose

COPY build ./
COPY entrypoint.sh ./

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "wait" ]
