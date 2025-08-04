# Global Chat - Чат-приложение по странам

## Описание проекта

Приложение для общения пользователей по странам. Пользователи могут заходить в чаты своих стран (например, русские в чат "Россия", американцы в чат "США" и т.д.) и общаться в реальном времени.

## Технологический стек

### Backend (NestJS)
- **@nestjs/common** - Основная библиотека NestJS
- **@nestjs/core** - Ядро NestJS
- **@nestjs/platform-express** - Express адаптер
- **@nestjs/websockets** - WebSocket поддержка для real-time чатов
- **@nestjs/platform-socket.io** - Socket.io адаптер
- **@nestjs/config** - Конфигурация приложения
- **@nestjs/jwt** - JWT аутентификация
- **@nestjs/passport** - Passport стратегии
- **passport-jwt** - JWT стратегия для Passport
- **passport-local** - Локальная стратегия аутентификации
- **bcryptjs** - Хеширование паролей
- **class-validator** - Валидация DTO
- **class-transformer** - Трансформация объектов
- **@nestjs/swagger** - API документация
- **helmet** - Безопасность HTTP заголовков
- **cors** - CORS поддержка
- **compression** - Сжатие ответов

### Frontend (React)
- **react** - Основная библиотека React
- **react-dom** - React DOM
- **@types/react** - TypeScript типы для React
- **@types/react-dom** - TypeScript типы для React DOM
- **socket.io-client** - Socket.io клиент для real-time соединения
- **react-router-dom** - Маршрутизация
- **@tanstack/react-query** - Управление состоянием и кэширование
- **zustand** - Управление глобальным состоянием
- **axios** - HTTP клиент
- **react-hook-form** - Управление формами
- **@hookform/resolvers** - Валидация форм
- **zod** - Схемы валидации
- **date-fns** - Работа с датами
- **react-hot-toast** - Уведомления
- **lucide-react** - Иконки
- **clsx** - Условные классы
- **tailwind-merge** - Объединение Tailwind классов

### UI (Shadcn/UI)
- **shadcn/ui** - UI-библиотека
- **tailwindcss** - CSS фреймворк
- **tailwindcss-animate** - Анимации

### База данных

**Выбор: PostgreSQL**

**Аргументация выбора PostgreSQL над MongoDB:**

1. **Структурированные данные**: Чат-приложение имеет четкую структуру данных (пользователи, сообщения, страны) - реляционная модель подходит лучше
2. **ACID транзакции**: Важна целостность данных при отправке сообщений, регистрации пользователей
3. **Сложные запросы**: Необходимы JOIN'ы для получения сообщений с информацией о пользователях
4. **Prisma ORM**: Лучше работает с PostgreSQL, предоставляет отличную типизацию
5. **Производительность**: PostgreSQL оптимизирован для чтения/записи структурированных данных
6. **Масштабируемость**: Хорошо масштабируется для чат-приложений
7. **JSON поддержка**: PostgreSQL поддерживает JSON поля для гибкости при необходимости

### ORM
- **@prisma/client** - Prisma клиент
- **prisma** - Prisma CLI

## Схема базы данных (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  country   String   // Код страны (RU, US, etc.)
  isOnline  Boolean  @default(false)
  lastSeen  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Отношения
  messages Message[]
  sessions Session[]

  @@map("users")
}

model Country {
  id          String @id @default(cuid())
  code        String @unique // ISO 3166-1 alpha-2 (RU, US, etc.)
  name        String // Полное название страны
  flag        String? // URL флага страны
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Отношения
  users User[]

  @@map("countries")
}

model Chat {
  id        String @id @default(cuid())
  countryId String
  name      String // Название чата (например, "Россия", "США")
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Отношения
  country   Country    @relation(fields: [countryId], references: [id])
  messages  Message[]

  @@map("chats")
}

model Message {
  id        String   @id @default(cuid())
  content   String
  userId    String
  chatId    String
  isEdited  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Отношения
  user User @relation(fields: [userId], references: [id])
  chat Chat @relation(fields: [chatId], references: [id])

  @@map("messages")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  // Отношения
  user User @relation(fields: [userId], references: [id])

  @@map("sessions")
}

model OnlineUser {
  id       String @id @default(cuid())
  userId   String @unique
  socketId String
  chatId   String
  joinedAt DateTime @default(now())

  // Отношения
  user User @relation(fields: [userId], references: [id])
  chat Chat @relation(fields: [chatId], references: [id])

  @@map("online_users")
}
```

## Структура проекта

```
global-chat/
├── backend/
│   ├── src/
│   │   ├── auth/           # Аутентификация
│   │   ├── users/          # Пользователи
│   │   ├── chats/          # Чаты
│   │   ├── messages/       # Сообщения
│   │   ├── countries/      # Страны
│   │   ├── websocket/      # WebSocket логика
│   │   ├── common/         # Общие утилиты
│   │   └── config/         # Конфигурация
│   ├── prisma/
│   │   └── schema.prisma   # Схема БД
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Страницы
│   │   ├── shared/         # Общее
│   │       └── utils/          # Утилиты
│   └── package.json
└── README.md
```

## Основные функции

### Backend
- Регистрация и аутентификация пользователей
- JWT токены для сессий
- WebSocket соединения для real-time чатов
- CRUD операции для пользователей, чатов, сообщений
- Валидация данных
- Обработка ошибок
- Логирование

### Frontend
- Регистрация и вход пользователей
- Выбор страны и входа в соответствующий чат
- Real-time отправка и получение сообщений
- Отображение онлайн пользователей
- Профиль пользователя
- Адаптивный дизайн
- Темная/светлая тема

## Команды для запуска

### Backend
```bash
cd backend
yarn install
npx prisma generate
npx prisma db push
yarn run start:dev
```

### Frontend
```bash
cd frontend
yarn install
yarn dev
```

## Дополнительные рекомендации

1. **Безопасность**: Использовать helmet, rate limiting, валидацию входных данных
2. **Производительность**: Кэширование, пагинация сообщений, оптимизация запросов
3. **Масштабируемость**: Redis для кэширования, горизонтальное масштабирование
4. **Мониторинг**: Логирование, метрики, health checks
5. **Тестирование**: Unit и e2e тесты для критических функций
