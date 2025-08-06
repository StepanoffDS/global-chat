# Users Module

Модуль для управления пользователями в приложении Global Chat.

## 🏗️ Структура модуля

```
users/
├── dto/                    # Data Transfer Objects
│   ├── update-user.dto.ts
│   ├── user-response.dto.ts
│   ├── search-users.dto.ts
│   └── online-users-response.dto.ts
├── guards/                 # Guards для безопасности
│   └── jwt-auth.guard.ts
├── decorators/            # Декораторы
│   └── current-user.decorator.ts
├── interceptors/          # Интерцепторы
│   └── transform.interceptor.ts
├── pipes/                 # Пайпы валидации
│   └── validation.pipe.ts
├── constants/             # Константы безопасности
│   └── security.constants.ts
├── types/                 # TypeScript типы
│   └── user.types.ts
├── users.controller.ts    # Контроллер
├── users.service.ts       # Сервис
└── users.module.ts        # Модуль
```

## 🔐 Безопасность

### JWT Аутентификация

- Все эндпоинты защищены JWT токенами
- Токены содержат `userId` для идентификации пользователя
- Автоматическая валидация токенов через `JwtAuthGuard`

### Валидация данных

- Строгая валидация всех входных данных
- Использование констант безопасности для ограничений
- Автоматическое удаление чувствительных данных из ответов

### Ограничения безопасности

- Минимальная длина пароля: 6 символов
- Максимальная длина пароля: 128 символов
- Имя пользователя: 3-20 символов, только буквы, цифры, подчеркивания и дефисы
- URL аватара: максимум 500 символов
- Поисковый запрос: 2-50 символов
- Пагинация: максимум 50 элементов на страницу

## 📡 API Endpoints

### GET /users/profile

Получить профиль текущего пользователя.

**Требования:** JWT токен

**Ответ:**

```json
{
  "id": "clx1234567890abcdef",
  "email": "user@example.com",
  "username": "john_doe",
  "avatar": "https://example.com/avatar.jpg",
  "isOnline": false,
  "lastSeen": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### PUT /users/profile

Обновить профиль текущего пользователя.

**Требования:** JWT токен

**Тело запроса:**

```json
{
  "username": "new_username",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Ответ:** Обновленный профиль пользователя

### GET /users/search

Поиск пользователей с пагинацией.

**Требования:** JWT токен

**Параметры запроса:**

- `query` (опционально): Поисковый запрос
- `page` (опционально): Номер страницы (по умолчанию: 1)
- `limit` (опционально): Количество элементов на странице (по умолчанию: 10)

**Ответ:**

```json
{
  "users": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### GET /users/online/:chatId

Получить список онлайн пользователей в чате.

**Требования:** JWT токен

**Ответ:**

```json
{
  "chatId": "clx1234567890abcdef",
  "users": [...],
  "total": 5
}
```

### GET /users/:id

Получить профиль пользователя по ID.

**Требования:** JWT токен

**Ответ:** Профиль пользователя

### GET /users/:id/stats

Получить статистику пользователя.

**Требования:** JWT токен

**Ответ:**

```json
{
  "totalMessages": 150,
  "joinDate": "2024-01-01T00:00:00Z",
  "lastSeen": "2024-01-15T10:30:00Z"
}
```

### DELETE /users/:id

Удалить аккаунт пользователя.

**Требования:** JWT токен (только собственный аккаунт)

**Ответ:** 204 No Content

## 🔧 Использование

### В других модулях

```typescript
import { UsersService } from '../users/users.service';

@Injectable()
export class SomeService {
  constructor(private usersService: UsersService) {}

  async someMethod() {
    // Получить пользователя
    const user = await this.usersService.findById('user-id');

    // Обновить онлайн статус
    await this.usersService.updateOnlineStatus('user-id', true);

    // Получить статистику
    const stats = await this.usersService.getUserStats('user-id');
  }
}
```

### JWT Guard

```typescript
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('some')
@UseGuards(JwtAuthGuard)
export class SomeController {
  // Все эндпоинты защищены JWT
}
```

### Current User Decorator

```typescript
import { CurrentUser } from '../users/decorators/current-user.decorator';

@Get('profile')
async getProfile(@CurrentUser() user: { userId: string }) {
  // user.userId содержит ID текущего пользователя
}
```

## 🚨 Обработка ошибок

### 401 Unauthorized

- Отсутствует JWT токен
- Недействительный или истекший токен

### 403 Forbidden

- Попытка удалить чужой аккаунт

### 404 Not Found

- Пользователь не найден
- Чат не найден

### 409 Conflict

- Имя пользователя уже занято

### 400 Bad Request

- Неверные данные в запросе
- Нарушение ограничений валидации

## 📊 Мониторинг

Модуль включает:

- Логирование всех операций
- Трансформация ответов (удаление чувствительных данных)
- Валидация входных данных
- Обработка ошибок с детальными сообщениями
