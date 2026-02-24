# Docker (frontend + backend + PostgreSQL, HTTPS без Nginx)

## Быстрый старт
1) Настрой переменные окружения:
   - `cp .env.example .env`
   - поменяй минимум `POSTGRES_PASSWORD` / `DB_PASSWORD` / `ADMIN_API_KEY`
2) Подготовь TLS-сертификаты (Node завершает TLS сам):
   - `mkdir -p tls`
   - `openssl req -x509 -nodes -newkey rsa:2048 -days 365 -keyout tls/tls.key -out tls/tls.crt -subj "/CN=localhost"`
3) Запуск:
   - `docker compose up -d --build`

## Порты
- Backend HTTPS: `APP_PORT` (по умолчанию `443`) → контейнер `backend:3000`
- Postgres: `POSTGRES_PORT` (по умолчанию `5433`) → контейнер `db:5432`

## Проверка
- `curl -k https://localhost:${APP_PORT}/api/health`
- Для публичного сертификата `-k` не нужен.

## Публичный base path
- `PUBLIC_BASE_PATH=/` (по умолчанию) — фронт открывается на `https://localhost:${APP_PORT}/`
- Если нужен префикс (например `/prof2`), поставь `PUBLIC_BASE_PATH=/prof2` и пересобери образ (`docker compose up -d --build`)

## TLS переменные
- `TLS_ENABLED=true|false` — включение HTTPS в Node
- `TLS_KEY_PATH` — путь к приватному ключу в контейнере (по умолчанию `/run/tls/tls.key`)
- `TLS_CERT_PATH` — путь к сертификату в контейнере (по умолчанию `/run/tls/tls.crt`)
- `TLS_CA_PATH` — опционально, путь к CA chain
- `TLS_PASSPHRASE` — опционально, passphrase для ключа

## Healthcheck переменные
- `HEALTHCHECK_ENABLED=true|false` — полностью включить/выключить проверку здоровья backend.
- `HEALTHCHECK_RUN_ONCE=true|false` — после первого успешного healthcheck создать marker и дальше возвращать `healthy` без повторной сетевой проверки.
- `HEALTHCHECK_MARKER_PATH` — путь к marker-файлу в контейнере (по умолчанию `/tmp/.backend-healthcheck-ok`).

## Данные БД
- Данные Postgres сохраняются в volume `pgdata`
- Первый запуск на пустом volume применяет `db/init.sql`
- Сброс (удалит данные БД): `docker compose down -v`

## Тесты бэкенда
- `npm test` (интеграционные тесты через Testcontainers; нужен Docker. Если Docker недоступен — тесты будут `skipped`. Чтобы падали, запускай с `REQUIRE_DOCKER=1`.)

## Защита CRUD
Сейчас write-ручки защищены `ADMIN_API_KEY`:
- передавай ключ заголовком `X-Admin-Key: <key>` (или `Authorization: Bearer <key>`)
- в `production` если `ADMIN_API_KEY` не задан — write-ручки выключены (ответ `503`)
