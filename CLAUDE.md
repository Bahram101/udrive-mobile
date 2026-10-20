@AGENTS.md

# uDrive Mobile

Мобильное приложение сервиса такси uDrive (город Чунджа, Казахстан) для **клиентов** и **водителей** (одно приложение, роль переключается).

**Всегда работай с agy** (см. раздел «Работа с agy»).

## Рабочее пространство uDrive

`D:\projects\uDrive\` содержит три отдельных репозитория:

- `uDrive-mobile` — это приложение.
- `uDrive-backend` — API (Next.js + Prisma + PostgreSQL), см. его `CLAUDE.md`. Приложение ходит в него напрямую (`EXPO_PUBLIC_API_URL`).
- `uDrive-web` — публичный сайт + админ-панель, см. его `CLAUDE.md`.

## Стек

- Expo SDK 57, Expo Router, React Native 0.86, React 19, TypeScript
- **Внимание**: `AGENTS.md` ссылается на документацию v54, а проект на SDK 57 — читай https://docs.expo.dev/versions/v57.0.0/ (или актуальную для версии в `package.json`).
- TanStack Query 5, axios, NativeWind 5 + Tailwind 4, gluestack-ui (`src/components/ui`)
- `expo-location` + `expo-task-manager` (фоновая геолокация), `expo-notifications` (push), `expo-secure-store` (токены), `react-native-maps`
- Только iOS и Android (web отключён: `react-native-maps` не работает на web)

## Структура

- `src/app/` — экраны Expo Router по группам: `(auth)` (телефон, OTP), `(onboarding)` (регистрация), `(client)`, `(driver)` (главная, статистика, кошелёк).
- `src/features/<feature>/` — `api/` (запросы), `hooks/` (React Query), `components/`, `*.types.ts`. Фичи: `auth`, `driver`, `orders`, `notifications`.
- `src/components/common/` — общие компоненты (`AppButton`, `AppInput`, `PhoneInput`, `ScreenLayout`, `SideMenu`, `BottomSheet` — универсальная модалка снизу экрана, переиспользуй её для любых всплывающих шторок вместо нового `Modal`); `src/components/ui/` — gluestack.
- `src/lib/` — `api/client.ts` (axios + Bearer-токен), `api/authInterceptor.ts` (refresh при 401), `storage/` (SecureStore для токенов, AsyncStorage для пользователя), `phone.ts`, `query/queryClient.ts`.
- `src/providers/` — `AuthProvider` (сессия), `AuthGate` (редирект неавторизованных), `QueryProvider`.

## Ключевые сценарии и контракт с backend

- **Вход**: телефон → код в Telegram-боте (если Telegram не привязан — ссылка на бота) → `verify-otp`. Ответ **422** = новый пользователь → экран регистрации (имя + роль) и повторная отправка того же кода. Максимум 5 попыток на код (429 — запросить новый).
- **Токены**: access 15 мин, refresh 30 дней, хранятся в SecureStore. При 401 interceptor один раз делает refresh (общий promise на параллельные запросы), при неудаче — выход.
- **Роль**: CLIENT ⇄ DRIVER через `switch-role` (нельзя при активном заказе), backend возвращает новые токены.
- **Заказ (клиент)**: у клиента может быть только один активный заказ (backend вернёт 409). Текущий заказ опрашивается каждые 5 с.
- **Водитель**: онлайн/офлайн (`/driver/status`, при выходе на линию нужны координаты), координаты в фоне (`/driver/location`), статусы заказа: arrive → start → complete, отмена.
- **Push**: Expo push-токен регистрируется для клиента и водителя; звуки `alarm.wav`, `arrived.wav`, каналы `orders-v2`, `order-status-v2`.
- Изменения API согласовывать с backend; не ломать существующий контракт.

## Принципы кода (обязательно)

- **Без дублирования (DRY).** Повторяющаяся логика — в одну общую функцию/хук/компонент. Перед написанием кода ищи, что уже есть (`components/common`, `lib`, хуки фич), и переиспользуй.
- **TypeScript без `any`**, типы ответов API в `*.types.ts`.
- **Данные с сервера — только через React Query** (`useQuery`/`useMutation` в `hooks/`), запросы — в `api/*.service.ts`; экраны не вызывают axios напрямую. После мутаций — `invalidateQueries`.
- **Ошибки**: через `withNormalizedError`; пользователю — понятный текст на русском, не «сырая» ошибка.
- **Без мусора**: никаких `console.log`, закомментированного кода, неиспользуемых импортов.
- **Минимальный дифф**, стиль как в соседнем коде; комментарии — только для неочевидного «почему».
- **Безопасность**: токены только в SecureStore (не в AsyncStorage); секреты и ключи — только через env/EAS secrets, не в git; не логировать токены, телефоны, коды.
- **Производительность**: без лишних ре-рендеров (`useMemo`/`useCallback` там, где это нужно), списки — через `FlatList`; геолокация — разумная частота, батарея водителя важна.
- **UX**: состояния загрузки/ошибки/пусто на каждом экране, disabled-кнопки во время запроса, safe area; отсутствие сети не должно «ронять» приложение.
- **Разрешения** (геолокация, уведомления): запрашивать с объяснением и корректно обрабатывать отказ.
- **Условная загрузка нативных модулей — через `await import(...)`, не `require(...)`.** `require` требует `eslint-disable` и это признак не современного кода. Пример: `expo-notifications` крашит Expo Go на Android уже на этапе загрузки модуля, поэтому его нельзя импортировать статически — `src/features/notifications/lib/safeNotifications.ts` (`loadNotifications()`) грузит его лениво через `await import("expo-notifications")` и возвращает `null` в неподдерживаемой среде. Это общий хелпер — переиспользуй его, не пиши вторую копию той же проверки в другом файле.
- Тексты интерфейса — на русском.

## Проверка перед сдачей

```bash
npx tsc --noEmit
npm run lint
```

Изменения UI/геолокации/push проверять на устройстве или эмуляторе; если не проверено — прямо об этом сказать.

## Git

- Conventional Commits на английском: `fix(orders): ...`, `feat(driver): ...`.
- Коммит/пуш — только по просьбе владельца. Не коммитить `.env`.
- `google-services.json` не хранится в git (`.gitignore`). Локально — файл в корне проекта (скачать из Firebase Console → Project settings → Android app). В EAS-сборках — файловая переменная `GOOGLE_SERVICES_JSON` (есть в development, preview, production). В `.env` её добавлять не нужно.
- API-ключи Firebase/Google Maps ограничивать в Google Cloud Console (пакет `com.udrive.mobile` + SHA-1).

## Общение

- Владелец пишет на узбекском или русском — отвечать на языке собеседника, коротко и простыми словами.
- **Все `.md` файлы — только на русском.**

## Работа с agy

- Задачи выполняют агенты agy (скилл `agy`), Claude — оркестратор: бриф, проверка, отчёт.
- **Всегда сначала расходуй квоту Gemini**, и только когда она исчерпана — переходи на Claude/GPT. Не наоборот.
- Перед запуском: `agy-ts status` и `agy models`. `gemini-3.1-pro-high` в этой установке agy вообще отсутствует (проверено и через Antigravity-аккаунт, и через резервный ключ — в обоих случаях список один и тот же: `gemini-3.8-flash-*`, `claude-sonnet-4-6`, `claude-opus-4-6-thinking`, `gpt-oss-120b-medium`). Лучшая доступная Gemini-модель на деле — `gemini-3.8-flash-high`; для `claude-opus-4-6-thinking` передавать `--effort ""`.
- Настроен резервный ключ `GEMINI_FALLBACK_TOKEN` (`C:\Users\Bahrom\.config\agy-ts\tokens.env`) — подключается автоматически, когда квота Antigravity исчерпана.
- Если квота agy закончилась — сообщить время восстановления и спросить владельца.

## Текущее состояние и задачи

- **Нужен heartbeat водителя**: сейчас координаты отправляются только при движении ≥20 м (`distanceInterval: 20` в `features/driver/services/locationTask.ts`). Стоящий водитель ничего не шлёт, и backend не может отличить закрытое приложение. План: отправлять сигнал каждые 30–60 с, пока водитель онлайн; backend хранит `lastSeenAt` и считает водителя офлайн после ~2 мин тишины.
- В коде есть отладочные `console.log` (например, в `lib/api/authInterceptor.ts`) — убрать при следующей правке этих файлов.
- Цена заказа пока фиксированная (400 ₸, задаётся на backend).
