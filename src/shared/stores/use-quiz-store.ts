import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Question = {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
};

type Answer = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
};

type QuizState = {
  questions: Question[];
  currentIndex: number;
  answers: Map<string, Answer>;
  score: number;
  isLoading: boolean;
  selectedOption: string;
  isChecked: boolean;
  topicId: string | null;
};

type QuizActions = {
  loadQuiz: (topicId: string) => Promise<void>;
  selectOption: (optionIndex: number) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; percentage: number };
  isLastQuestion: () => boolean;
  getCurrentAnswer: () => Answer | null;
};

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: new Map(),
  score: 0,
  isLoading: false,
  selectedOption: "",
  isChecked: false,
  topicId: null,
};

export const useQuizStore = create<QuizState & QuizActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      loadQuiz: async (topicId) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const res = await fetch(`/api/quiz/${topicId}`, {
            cache: "no-store",
          });

          if (!res.ok) throw new Error("Failed to load quiz");

          const data = await res.json();

          set((state) => {
            state.questions = data.questions || [];
            state.currentIndex = 0;
            state.answers = new Map();
            state.score = 0;
            state.selectedOption = "";
            state.isChecked = false;
            state.topicId = topicId;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
          });
          throw error;
        }
      },

      selectOption: (optionIndex) => {
        const { isChecked } = get();
        if (isChecked) return;

        set((state) => {
          state.selectedOption = String(optionIndex);
        });
      },

      checkAnswer: () => {
        const { selectedOption, questions, currentIndex } = get();
        if (selectedOption === "" || !questions[currentIndex]) return;

        const question = questions[currentIndex];
        const selectedIndex = parseInt(selectedOption, 10);
        const isCorrect = selectedIndex === question.correctIndex;

        set((state) => {
          state.isChecked = true;
          state.answers.set(question.id, {
            questionId: question.id,
            selectedIndex,
            isCorrect,
          });
          if (isCorrect) {
            state.score += 1;
          }
        });
      },

      nextQuestion: () => {
        const { currentIndex, questions } = get();
        if (currentIndex >= questions.length - 1) return;

        set((state) => {
          state.currentIndex += 1;
          state.selectedOption = "";
          state.isChecked = false;
        });
      },

      resetQuiz: () => {
        const { topicId } = get();
        if (!topicId) return;

        get().loadQuiz(topicId);
      },

      getCurrentQuestion: () => {
        const { questions, currentIndex } = get();
        return questions[currentIndex] || null;
      },

      getProgress: () => {
        const { currentIndex, questions } = get();
        const total = questions.length;
        const current = currentIndex + 1;
        const percentage = total > 0 ? (current / total) * 100 : 0;

        return { current, total, percentage };
      },

      isLastQuestion: () => {
        const { currentIndex, questions } = get();
        return currentIndex === questions.length - 1;
      },

      getCurrentAnswer: () => {
        const question = get().getCurrentQuestion();
        if (!question) return null;

        return get().answers.get(question.id) || null;
      },
    })),
    { name: "QuizStore" }
  )
);

// ✅ FIXED: Direct state selectors instead of method calls
export const useQuizQuestion = () =>
  useQuizStore((state) => state.questions[state.currentIndex] || null);

export const useQuizProgress = () => {
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const total = useQuizStore((state) => state.questions.length);

  const current = currentIndex + 1;
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return { current, total, percentage };
};

export const useQuizActions = () => {
  const loadQuiz = useQuizStore((state) => state.loadQuiz);
  const selectOption = useQuizStore((state) => state.selectOption);
  const checkAnswer = useQuizStore((state) => state.checkAnswer);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  return {
    loadQuiz,
    selectOption,
    checkAnswer,
    nextQuestion,
    resetQuiz,
  };
};

// Additional optimized selectors
export const useQuizUI = () => {
  const isLoading = useQuizStore((state) => state.isLoading);
  const selectedOption = useQuizStore((state) => state.selectedOption);
  const isChecked = useQuizStore((state) => state.isChecked);
  const score = useQuizStore((state) => state.score);

  return { isLoading, selectedOption, isChecked, score };
};

export const useCurrentAnswer = () => {
  const question = useQuizQuestion();
  const answers = useQuizStore((state) => state.answers);

  if (!question) return null;
  return answers.get(question.id) || null;
};

export const useIsLastQuestion = () => {
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const total = useQuizStore((state) => state.questions.length);

  return currentIndex === total - 1;
};
