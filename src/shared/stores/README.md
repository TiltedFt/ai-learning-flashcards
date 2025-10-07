# Zustand Stores Documentation

## Архитектура

Все stores используют оптимизированные паттерны с:
- **Immer middleware** - для immutable state updates
- **Devtools middleware** - для отладки в Redux DevTools
- **Селекторы** - для предотвращения лишних ре-рендеров
- **Typed actions** - полная типизация TypeScript

## Stores

### 1. Quiz Store (`use-quiz-store.ts`)

Управляет состоянием квиза.

#### State
```typescript
{
  questions: Question[];
  currentIndex: number;
  answers: Map<string, Answer>;
  score: number;
  isLoading: boolean;
  selectedOption: string;
  isChecked: boolean;
}
```

#### Actions
- `loadQuiz(bookId, chapterId, topicId)` - загрузить квиз
- `selectOption(index)` - выбрать ответ
- `checkAnswer()` - проверить ответ
- `nextQuestion()` - следующий вопрос
- `resetQuiz()` - перезапустить квиз

#### Использование
```typescript
import { useQuizStore } from "@/shared/stores";

function QuizComponent() {
  const {
    isLoading,
    loadQuiz,
    selectOption,
    checkAnswer,
    getCurrentQuestion,
  } = useQuizStore();

  // или используйте оптимизированные селекторы
  const question = useQuizQuestion();
  const progress = useQuizProgress();
  const actions = useQuizActions();
}
```

---

### 2. Books Store (`use-books-store.ts`)

Кэширует данные о книгах, главах и топиках с TTL кэшем (5 минут).

#### State
```typescript
{
  books: Map<string, CacheEntry<Book>>;
  booksList: CacheEntry<Book[]> | null;
  chapters: Map<string, CacheEntry<Chapter[]>>;
  topics: Map<string, CacheEntry<Topic[]>>;
}
```

#### Actions
- `fetchBooks()` - загрузить список книг
- `fetchBook(id)` - загрузить одну книгу
- `fetchChapters(bookId)` - загрузить главы
- `fetchTopics(bookId, chapterId)` - загрузить топики
- `invalidateBooks()` - инвалидировать кэш книг
- `invalidateChapters(bookId)` - инвалидировать кэш глав
- `invalidateTopics(chapterId)` - инвалидировать кэш топиков
- `invalidateAll()` - очистить весь кэш

#### Использование
```typescript
import { useChapters, useBooksActions } from "@/shared/stores";

function ChaptersComponent({ bookId }: { bookId: string }) {
  const { data, isLoading, error } = useChapters(bookId);
  const { fetchChapters, invalidateChapters } = useBooksActions();

  useEffect(() => {
    fetchChapters(bookId);
  }, [bookId, fetchChapters]);

  const handleCreate = () => {
    invalidateChapters(bookId);
    fetchChapters(bookId);
  };
}
```

#### Преимущества над SWR
1. **Centralized cache** - все данные в одном месте
2. **Typed state** - полная типизация без дополнительных generic
3. **Manual invalidation** - контроль над кэшем
4. **TTL cache** - автоматическое обновление устаревших данных
5. **No network waterfalls** - оптимизация загрузок

---

### 3. UI Store (`use-ui-store.ts`)

Глобальное состояние UI (диалоги, загрузки, нотификации).

#### State
```typescript
{
  dialogs: {
    createBook: boolean;
    addChapter: boolean;
    addTopic: boolean;
  };
  dialogContext: {
    bookId?: string;
    chapterId?: string;
    bookTitle?: string;
  };
  globalLoading: boolean;
  loadingMessage: string | null;
  notifications: Notification[];
}
```

#### Actions
- `openDialog(name, context?)` - открыть диалог
- `closeDialog(name)` - закрыть диалог
- `closeAllDialogs()` - закрыть все диалоги
- `setGlobalLoading(loading, message?)` - глобальная загрузка
- `addNotification(type, message)` - добавить уведомление
- `removeNotification(id)` - удалить уведомление

#### Использование
```typescript
import { useDialog, useUIActions } from "@/shared/stores";

// В компоненте с диалогом
function AddChapterButton({ bookId }: { bookId: string }) {
  const dialog = useDialog("addChapter");

  return (
    <>
      <Button onClick={() => dialog.open()}>Add Chapter</Button>
      <AddChapterDialog
        open={dialog.isOpen}
        onOpenChange={(open) => open ? dialog.open() : dialog.close()}
        bookId={bookId}
      />
    </>
  );
}

// Или используйте actions напрямую
function SomeComponent() {
  const { openDialog, setGlobalLoading } = useUIActions();

  const handleAction = async () => {
    setGlobalLoading(true, "Processing...");
    await doSomething();
    setGlobalLoading(false);
  };
}
```

---

## Best Practices

### 1. Используйте селекторы для оптимизации
```typescript
// ❌ Плохо - компонент ре-рендерится при любом изменении
const store = useQuizStore();

// ✅ Хорошо - только при изменении нужных полей
const { isLoading, score } = useQuizStore();

// ✅ Еще лучше - custom селекторы
const question = useQuizQuestion();
const actions = useQuizActions();
```

### 2. Invalidate после мутаций
```typescript
const handleCreate = async () => {
  await createChapter(data);
  invalidateChapters(bookId); // Очистить кэш
  fetchChapters(bookId);       // Обновить данные
};
```

### 3. Проверяйте кэш перед fetch
```typescript
// Store автоматически проверяет TTL кэша
useEffect(() => {
  fetchChapters(bookId); // Не загрузит, если кэш свежий
}, [bookId, fetchChapters]);
```

### 4. Используйте dialog context
```typescript
// Открыть с контекстом
openDialog("addChapter", { bookId: "123" });

// В диалоге получить контекст
const context = useDialog("addChapter").context;
console.log(context.bookId); // "123"
```

---

## Migration Guide

### Из useState в Quiz Store
```typescript
// ❌ Старый код
const [quiz, setQuiz] = useState(null);
const [idx, setIdx] = useState(0);
const [score, setScore] = useState(0);

// ✅ Новый код
const { loadQuiz, getCurrentQuestion, score } = useQuizStore();
```

### Из SWR в Books Store
```typescript
// ❌ Старый код
const { data, isLoading, mutate } = useSWR(
  `/api/books/${bookId}/chapters`,
  fetcher
);

// ✅ Новый код
const { data, isLoading } = useChapters(bookId);
const { fetchChapters, invalidateChapters } = useBooksActions();
```

### Из useState в UI Store
```typescript
// ❌ Старый код
const [open, setOpen] = useState(false);

// ✅ Новый код
const dialog = useDialog("addChapter");
```

---

## Debugging

### Redux DevTools
Все stores подключены к Redux DevTools. Откройте расширение в браузере:
1. Store: `QuizStore`, `BooksStore`, `UIStore`
2. Просмотр действий и изменений state
3. Time-travel debugging

### Cache Inspection
```typescript
// Проверить возраст кэша
const age = useBooksStore.getState().getCacheAge("books");
console.log(`Cache age: ${age}ms`);

// Очистить весь кэш
useBooksStore.getState().invalidateAll();
```

---

## Performance Tips

1. **Используйте shallow селекторы** - выбирайте только нужные поля
2. **Batch updates** - Zustand автоматически батчит обновления
3. **TTL кэш** - настроен на 5 минут, изменить в `CACHE_TTL`
4. **Immer** - оптимизированные immutable updates
5. **Мемоизация** - используйте `useMemo` для вычисляемых значений

---

## Testing

```typescript
import { useQuizStore } from "@/shared/stores";

test("quiz store", () => {
  const { loadQuiz, selectOption, checkAnswer } = useQuizStore.getState();

  // Загрузить квиз
  await loadQuiz("book1", "ch1", "topic1");

  // Выбрать ответ
  selectOption(0);

  // Проверить
  checkAnswer();

  expect(useQuizStore.getState().score).toBe(1);
});
```
