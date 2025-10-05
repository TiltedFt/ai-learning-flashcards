import { getSession } from "@/services/auth.service";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">AI Learning Flashcards</h1>
      <p className="text-muted-foreground">
        Upload your bookovski friendowskiis
      </p>
    </main>
  );
}
