FROM node:22.0.0-alpine3.18 AS builder

WORKDIR /app

COPY . ./
RUN npm install
RUN npm run postinstall
RUN npm run build
RUN npm prune --production

RUN ls

FROM node:22.0.0-alpine3.18 AS runner
WORKDIR  /app

COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/.env .
COPY --from=builder /app/node_modules node_modules

RUN ls

EXPOSE 8000

CMD ["npm","run","start"]