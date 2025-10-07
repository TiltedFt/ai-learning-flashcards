# Phase 6: API Layer ✅

## Что было сделано

### 1. Улучшен `/shared/api/client.ts`

**Добавлено:**
- ✅ **Retry логика** с exponential backoff (3 попытки по умолчанию)
- ✅ **Timeout** для запросов (30 секунд по умолчанию)
- ✅ **FormData support** - автоматическое определение и обработка
- ✅ **Credentials включены** по умолчанию (`credentials: "include"`)
- ✅ **PATCH метод** добавлен
- ✅ **Конфигурируемость** - можно переопределить retry/timeout для каждого запроса

**Пример использования:**
```ts
import { post, get } from "@/shared/api/client";

// Simple POST
const response = await post("/api/login", { email, password });

// POST with FormData
const formData = new FormData();
formData.append("file", file);
const response = await post("/api/upload", formData);

// With custom config
const response = await get("/api/data", {
  maxRetries: 5,
  timeout: 60000
});
```

### 2. Созданы типизированные API hooks

#### **Auth Feature** (`src/features/auth/api/`)
- ✅ `use-login.ts` - логин с автоматическим retry
- ✅ `use-signup.ts` - регистрация
- ✅ `use-logout.ts` - выход из системы

**API:**
```ts
const { login, isLoading, error } = useLogin();
const result = await login({ email, password });
```

#### **Book Management Feature** (`src/features/book-management/api/`)
- ✅ `use-create-book.ts` - создание книги с FormData
- ✅ `use-create-chapter.ts` - создание главы
- ✅ `use-create-topic.ts` - создание топика

**API:**
```ts
const { createBook, isLoading, error } = useCreateBook();
const result = await createBook({ title, author, file });

const { createChapter } = useCreateChapter();
await createChapter(bookId, { title, pageStart, pageEnd });
```

### 3. Рефакторинг компонентов

**До:** Прямые `fetch()` вызовы с дублированной логикой

```ts
// ❌ Old way
const r = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
  credentials: "include",
});
const j = await r.json();
if (r.status !== 200) {
  if (j.details) notify.error(j.details);
  else if (j.error) notify.error(j.error);
  else notify.error("Login failed");
  return;
}
```

**После:** Чистые hooks с централизованной логикой

```ts
// ✅ New way
const { login } = useLogin();
const result = await login(data);
if (!result) {
  notify.error("Login failed");
  return;
}
```

**Отрефакторены файлы:**
- ✅ [login-form.tsx](src/features/auth/ui/login-form.tsx:21) - использует `useLogin()`
- ✅ [signup-form.tsx](src/features/auth/ui/signup-form.tsx:22) - использует `useSignup()`
- ✅ [create-book-dialog.tsx](src/features/book-management/ui/create-book-dialog.tsx:25) - использует `useCreateBook()`
- ✅ [add-chapter-dialog.tsx](src/features/book-management/ui/add-chapter-dialog.tsx:19) - использует `useCreateChapter()`
- ✅ [add-topic-dialog.tsx](src/features/book-management/ui/add-topic-dialog.tsx:17) - использует `useCreateTopic()`

### 4. Barrel Exports

**Созданы index файлы для удобного импорта:**

- ✅ [src/features/auth/api/index.ts](src/features/auth/api/index.ts)
- ✅ [src/features/book-management/api/index.ts](src/features/book-management/api/index.ts)
- ✅ [src/shared/api/index.ts](src/shared/api/index.ts)

**Использование:**
```ts
// Before
import { useLogin } from "@/features/auth/api/use-login";
import { useSignup } from "@/features/auth/api/use-signup";

// After
import { useLogin, useSignup } from "@/features/auth/api";
```

## Результаты

### 📊 Метрики
- **Создано API hooks:** 6
- **Отрефакторено компонентов:** 5
- **Удалено дублированного кода:** ~150 строк
- **Улучшен** client.ts с retry/timeout/FormData

### 🎯 Достижения

✅ **Централизованная логика**
- Все API запросы идут через единый client
- Автоматический retry при сетевых ошибках
- Timeout защита для всех запросов

✅ **Type Safety**
- Типизированные request/response для всех hooks
- Автокомплит и валидация типов

✅ **DRY Principle**
- Нет дублирования fetch логики
- Переиспользуемые hooks

✅ **Better UX**
- Автоматические повторы при сбоях
- Loading states из коробки
- Единый error handling

✅ **Легко тестировать**
- Hooks можно легко мокать
- Изолированная логика API

### 🔧 Технические детали

**Retry Logic:**
```ts
// Exponential backoff: 1s, 2s, 4s
maxRetries: 3
retryDelay: 1000ms (doubles each attempt)
```

**Timeout:**
```ts
timeout: 30000ms (30 seconds)
// Можно переопределить для конкретных запросов
```

**FormData Support:**
```ts
// Автоматически определяет FormData
const isFormData = options?.body instanceof FormData;
// Не добавляет Content-Type header для FormData
```

## Примеры использования

### Simple POST Request
```ts
import { useLogin } from "@/features/auth/api";

const LoginComponent = () => {
  const { login, isLoading } = useLogin();

  const handleSubmit = async (data) => {
    const result = await login(data);
    if (result) {
      navigate("/dashboard");
    }
  };

  return <button disabled={isLoading}>Login</button>;
};
```

### File Upload
```ts
import { useCreateBook } from "@/features/book-management/api";

const UploadComponent = () => {
  const { createBook, isLoading } = useCreateBook();

  const handleUpload = async (file: File) => {
    const result = await createBook({
      title: "My Book",
      file
    });

    if (result) {
      console.log("Created:", result.id);
    }
  };
};
```

### Custom Config
```ts
import { post } from "@/shared/api/client";

// Long-running request with custom timeout
const result = await post("/api/process", data, {
  timeout: 120000, // 2 minutes
  maxRetries: 5,   // 5 retries
});
```

## Migration Guide

### Для добавления нового API endpoint:

1. **Создать hook** в `src/features/{feature}/api/use-{action}.ts`
```ts
import { post } from "@/shared/api/client";

export function useMyAction() {
  const [isLoading, setIsLoading] = useState(false);

  const myAction = async (data: Input): Promise<Output | null> => {
    setIsLoading(true);
    try {
      const response = await post<Output>("/api/my-endpoint", data);
      return response.data ?? null;
    } finally {
      setIsLoading(false);
    }
  };

  return { myAction, isLoading };
}
```

2. **Экспортировать** в `index.ts`
```ts
export { useMyAction } from "./use-my-action";
```

3. **Использовать** в компоненте
```ts
import { useMyAction } from "@/features/{feature}/api";

const { myAction, isLoading } = useMyAction();
const result = await myAction(data);
```

## Next Steps (опционально)

Если потребуется дальнейшее улучшение:

- [ ] Добавить caching layer (React Query / SWR)
- [ ] Добавить optimistic updates
- [ ] Добавить request deduplication
- [ ] Добавить request cancellation
- [ ] Добавить progress tracking для uploads
- [ ] Добавить rate limiting

---

**Status:** ✅ COMPLETED
**Date:** 2025-10-07
**Priority:** LOW (as specified)
