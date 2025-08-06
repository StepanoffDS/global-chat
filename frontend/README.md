# Global Chat Frontend

Фронтенд приложение для Global Chat - чат-приложения по странам.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
yarn install

# Запуск в режиме разработки
yarn dev

# Сборка для продакшена
yarn build

# Предварительный просмотр сборки
yarn preview
```

## 📋 Требования

- Node.js 18+
- Yarn или npm
- Backend API (должен быть запущен на порту 3001)

## 🏗️ Структура проекта

```
frontend/
├── src/
│   ├── components/          # React компоненты
│   │   ├── ui/             # UI компоненты (shadcn/ui)
│   │   ├── auth/           # Компоненты аутентификации
│   │   ├── chat/           # Компоненты чата
│   │   └── layout/         # Компоненты макета
│   ├── pages/              # Страницы приложения
│   ├── hooks/              # Кастомные React хуки
│   ├── services/           # API сервисы
│   ├── stores/             # Zustand сторы
│   ├── types/              # TypeScript типы
│   ├── utils/              # Утилиты
│   └── styles/             # Стили
├── public/                 # Статические файлы
└── package.json
```

## 🔧 Настройка

### 1. Переменные окружения

Создайте файл `.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### 2. Установка зависимостей

```bash
# Основные зависимости
yarn add react react-dom react-router-dom
yarn add @tanstack/react-query zustand
yarn add socket.io-client axios
yarn add react-hook-form @hookform/resolvers zod
yarn add date-fns react-hot-toast
yarn add lucide-react clsx tailwind-merge

# UI библиотеки
yarn add @radix-ui/react-avatar
yarn add @radix-ui/react-button
yarn add @radix-ui/react-dialog
yarn add @radix-ui/react-dropdown-menu
yarn add @radix-ui/react-input
yarn add @radix-ui/react-label
yarn add @radix-ui/react-select
yarn add @radix-ui/react-tabs
yarn add @radix-ui/react-toast
yarn add @radix-ui/react-tooltip

# Стили
yarn add -D tailwindcss tailwindcss-animate
yarn add -D @types/node
```

## 📡 API Интеграция

### Аутентификация

```typescript
// services/auth.service.ts
export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, username: string, password: string) {
    const response = await api.post('/auth/register', {
      email,
      username,
      password,
    });
    return response.data;
  },

  async logout() {
    await api.post('/sessions/logout');
  },
};
```

### Пользователи

```typescript
// services/users.service.ts
export const usersService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateUserDto) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async searchUsers(query: string, page = 1, limit = 10) {
    const response = await api.get('/users/search', {
      params: { query, page, limit },
    });
    return response.data;
  },

  async getOnlineUsers(chatId: string) {
    const response = await api.get(`/users/online/${chatId}`);
    return response.data;
  },
};
```

### Страны

```typescript
// services/countries.service.ts
export const countriesService = {
  async getCountries() {
    const response = await api.get('/countries');
    return response.data;
  },

  async getActiveCountries() {
    const response = await api.get('/countries/active');
    return response.data;
  },

  async getCountryByCode(code: string) {
    const response = await api.get(`/countries/code/${code}`);
    return response.data;
  },
};
```

### Чаты

```typescript
// services/chats.service.ts
export const chatsService = {
  async getChats() {
    const response = await api.get('/chats');
    return response.data;
  },

  async getChatById(id: string) {
    const response = await api.get(`/chats/${id}`);
    return response.data;
  },

  async getChatByCountry(countryId: string) {
    const response = await api.get(`/chats/country/${countryId}`);
    return response.data;
  },

  async joinChat(chatId: string) {
    await api.post('/chats/join', { chatId });
  },

  async leaveChat(chatId: string) {
    await api.delete(`/chats/${chatId}/leave`);
  },
};
```

### Сообщения

```typescript
// services/messages.service.ts
export const messagesService = {
  async getMessages(chatId: string, page = 1, limit = 20) {
    const response = await api.get(`/messages/chat/${chatId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async sendMessage(content: string, chatId: string) {
    const response = await api.post('/messages', { content, chatId });
    return response.data;
  },

  async editMessage(messageId: string, content: string) {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  async deleteMessage(messageId: string) {
    await api.delete(`/messages/${messageId}`);
  },

  async getRecentMessages(chatId: string) {
    const response = await api.get(`/messages/chat/${chatId}/recent`);
    return response.data;
  },
};
```

## 🔌 WebSocket Интеграция

### Подключение к WebSocket

```typescript
// services/websocket.service.ts
import { io, Socket } from 'socket.io-client';

export class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string, chatId: string) {
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token, chatId },
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('newMessage', (message) => {
      // Обработка нового сообщения
    });

    this.socket.on('messageEdited', (message) => {
      // Обработка редактирования сообщения
    });

    this.socket.on('messageDeleted', (data) => {
      // Обработка удаления сообщения
    });

    this.socket.on('userJoined', (data) => {
      // Обработка присоединения пользователя
    });

    this.socket.on('userLeft', (data) => {
      // Обработка выхода пользователя
    });

    this.socket.on('userTyping', (data) => {
      // Обработка статуса печати
    });
  }

  sendMessage(content: string, chatId: string) {
    this.socket?.emit('sendMessage', { content, chatId });
  }

  editMessage(messageId: string, content: string) {
    this.socket?.emit('editMessage', { messageId, content });
  }

  deleteMessage(messageId: string) {
    this.socket?.emit('deleteMessage', { messageId });
  }

  joinChat(chatId: string) {
    this.socket?.emit('joinChat', { chatId });
  }

  setTyping(chatId: string, isTyping: boolean) {
    this.socket?.emit('typing', { chatId, isTyping });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
```

## 🎨 UI Компоненты

### Настройка shadcn/ui

```bash
# Инициализация shadcn/ui
npx shadcn@latest init

# Добавление компонентов
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add avatar
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add tooltip
```

### Пример компонента чата

```typescript
// components/chat/ChatRoom.tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useMessages } from '@/hooks/useMessages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { OnlineUsers } from './OnlineUsers';

interface ChatRoomProps {
  chatId: string;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const [isTyping, setIsTyping] = useState(false);
  const { messages, sendMessage, editMessage, deleteMessage } = useMessages(chatId);
  const { socket, isConnected } = useWebSocket(chatId);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleEditMessage = (messageId: string, content: string) => {
    editMessage(messageId, content);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        </div>
        <MessageInput
          onSend={handleSendMessage}
          onTyping={setIsTyping}
          disabled={!isConnected}
        />
      </div>
      <div className="w-64 border-l">
        <OnlineUsers chatId={chatId} />
      </div>
    </div>
  );
}
```

## 🗂️ Управление состоянием

### Zustand Store

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
```

### React Query для кэширования

```typescript
// hooks/useMessages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '@/services/messages.service';

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messagesService.getMessages(chatId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      messagesService.sendMessage(content, chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => messagesService.editMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => messagesService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  return {
    messages: messagesData?.messages || [],
    total: messagesData?.total || 0,
    isLoading,
    sendMessage: sendMessageMutation.mutate,
    editMessage: editMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
  };
}
```

## 🛣️ Маршрутизация

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## 🔐 Аутентификация

### Контекст аутентификации

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login: loginStore, logout: logoutStore, token } = useAuthStore();

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    loginStore(response.user, response.token);
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await authService.register(email, username, password);
    loginStore(response.user, response.token);
  };

  const logout = async () => {
    await authService.logout();
    logoutStore();
  };

  // Проверка токена при загрузке
  useEffect(() => {
    if (token) {
      // Можно добавить проверку валидности токена
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 🎯 Основные страницы

### 1. Страница входа

```typescript
// pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Успешный вход!');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Вход в Global Chat</h1>
          <p className="text-gray-600">Выберите свою страну и начните общение</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <p className="text-center">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### 2. Главная страница чата

```typescript
// pages/ChatPage.tsx
import { useState, useEffect } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { useChats } from '@/hooks/useChats';
import { CountrySelector } from '@/components/chat/CountrySelector';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { useAuthStore } from '@/stores/auth.store';

export function ChatPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { countries, isLoading: countriesLoading } = useCountries();
  const { chats, isLoading: chatsLoading } = useChats();

  useEffect(() => {
    if (user?.countryId) {
      setSelectedCountry(user.countryId);
    }
  }, [user]);

  const handleCountrySelect = async (countryId: string) => {
    setSelectedCountry(countryId);
    // Найти чат для выбранной страны
    const chat = chats?.find(c => c.countryId === countryId);
    if (chat) {
      setSelectedChat(chat.id);
    }
  };

  if (countriesLoading || chatsLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Global Chat</h1>
          <div className="flex items-center space-x-4">
            <span>Привет, {user?.username}!</span>
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
              onSelect={handleCountrySelect}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {selectedChat ? (
          <ChatRoom chatId={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Выберите страну для начала общения</p>
          </div>
        )}
      </main>
    </div>
  );
}
```

## 🚀 Развертывание

### Сборка для продакшена

```bash
# Сборка
yarn build

# Предварительный просмотр
yarn preview
```

### Переменные окружения для продакшена

```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

## 📚 Полезные ресурсы

- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🐛 Отладка

### Проверка WebSocket соединения

```typescript
// В компоненте чата
useEffect(() => {
  if (socket) {
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }
}, [socket]);
```

### Логирование API запросов

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      const parsedToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${parsedToken.state.token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  },
);

export default api;
```
