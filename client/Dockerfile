FROM node:22.0.0-alpine3.18 AS builder

WORKDIR /app
COPY . ./

RUN npm install
RUN npm run build

FROM node:22.0.0-alpine3.18 AS runner

WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/.next .next

RUN npm install --omit=dev
RUN ls

EXPOSE 3000

CMD ["npm","run","start"]
