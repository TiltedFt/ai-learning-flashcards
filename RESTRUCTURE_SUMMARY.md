# Реорганизация структуры проекта

## Цель
Переход от плоской структуры к Feature-Sliced Design (FSD) архитектуре для улучшения масштабируемости и поддерживаемости.

## Новая структура

```
src/
├── app/                      # Next.js App Router (роуты и страницы)
│   ├── api/                  # API routes (реэкспорты из features)
│   ├── books/
│   ├── login/
│   ├── sign-up/
│   └── layout.tsx
├── entities/                 # Бизнес-сущности
│   ├── book/model/schema.ts
│   ├── chapter/model/schema.ts
│   ├── quiz/model/schema.ts
│   ├── topic/model/schema.ts
│   └── user/model/schema.ts
├── features/                 # Фичи приложения
│   ├── auth/
│   │   ├── api/              # login, signup, logout routes
│   │   └── ui/               # login-form, signup-form
│   ├── book-management/
│   │   ├── api/              # CRUD API для книг, глав, тем
│   │   └── ui/               # Диалоги создания/редактирования
│   └── quiz-practice/
│       ├── api/              # quiz route
│       └── ui/               # QuizRunner
├── widgets/                  # Композитные UI блоки
│   ├── books-table/
│   ├── navbar/
│   └── pagination/
├── shared/                   # Общий код
│   ├── api/                  # api-handler
│   ├── lib/                  # db, errors, utils, store
│   └── ui/
│       ├── components/       # shadcn/ui компоненты
│       ├── txt-input-field.tsx
│       └── breadcrumbs.tsx
├── core/                     # Инфраструктура
│   ├── repositories/         # book.repo, chapter.repo, topic.repo, user.repo
│   └── services/             # auth, books, openai, pdf, quiz-generation
└── middleware.ts
```

## Что было изменено

### Удалено
- ❌ `src/components/` (кроме `ui/` → `shared/ui/components/`)
- ❌ `src/contracts/` → `entities/*/model/`
- ❌ `src/lib/` → `shared/lib/` + `core/`
- ❌ `src/services/` → `core/services/`
- ❌ `src/widgets/` (пустые папки)
- ❌ Пустые `src/shared/*` подпапки

### Добавлено
- ✅ `entities/` - 5 бизнес-сущностей со схемами
- ✅ `features/` - 3 фичи (auth, book-management, quiz-practice)
- ✅ `widgets/` - 3 виджета (books-table, navbar, pagination)
- ✅ `core/` - repositories + services
- ✅ `index.ts` файлы для Public API каждого слоя

### Переименовано/Перемещено
- 📦 `contracts/*.ts` → `entities/*/model/schema.ts`
- 📦 `components/login-form.tsx` → `features/auth/ui/`
- 📦 `components/signup-form.tsx` → `features/auth/ui/`
- 📦 `components/books/*` → `features/book-management/ui/`
- 📦 `components/navbar*` → `widgets/navbar/`
- 📦 `lib/queries/*.repo.ts` → `core/repositories/`
- 📦 `services/*.service.ts` → `core/services/`
- 📦 `app/api/books/[bookId]/.../route.ts` → `features/book-management/api/`
- 📦 `app/api/login|signup|logout/route.ts` → `features/auth/api/`

## Обновленные импорты

```typescript
// Было
import { BookSchema } from '@/contracts/book-schema'
import { BooksTable } from '@/components/books/books-table'
import { bookRepository } from '@/lib/queries/book.repo'
import { getSession } from '@/services/auth.service'

// Стало
import { BookSchema } from '@/entities/book'
import { BooksTable } from '@/widgets/books-table'
import { bookRepository } from '@/core/repositories/book.repo'
import { getSession } from '@/core/services/auth.service'
```

## API Routes

API routes в `app/api/` теперь являются реэкспортами:

```typescript
// app/api/login/route.ts
export { POST } from '@/features/auth/api/login.route'

// app/api/books/route.ts
export { GET, POST } from '@/features/book-management/api/books.route'
```

Это позволяет:
- ✅ Сохранить Next.js роутинг
- ✅ Изолировать бизнес-логику в features
- ✅ Переиспользовать API handlers в других местах

## Скрипты реорганизации

Созданы 3 bash-скрипта:
1. `restructure.sh` - создание структуры и перемещение файлов
2. `create-index-files.sh` - создание index.ts для Public API
3. `update-imports.sh` - массовое обновление импортов
4. `fix-exports.sh` - исправление default/named exports

## Результаты

✅ **Проект успешно собирается** (`npm run build`)
✅ **Все импорты обновлены**
✅ **API routes работают**
✅ **Нет критических ошибок** (только ESLint warnings)

## Следующие шаги (опционально)

1. Исправить ESLint warnings (any, unused vars)
2. Добавить тесты для features
3. Создать README для каждого слоя архитектуры
4. Настроить path alias для более коротких импортов

## Преимущества новой структуры

1. **Масштабируемость** - легко добавлять новые фичи
2. **Изоляция** - каждая фича независима
3. **Переиспользуемость** - shared/ui и core переиспользуются
4. **Понятность** - четкое разделение ответственности
5. **Senior-level** - соответствует best practices крупных проектов
