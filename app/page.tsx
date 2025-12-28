export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero - Titulo + Subtitulo */}
      <section className="flex min-h-[50vh] items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-400">Hero</p>
      </section>

      {/* Input - Drama + Selector de Modo */}
      <section className="flex min-h-[50vh] items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-400">Input</p>
      </section>

      {/* Response - Roast + Conselho + Fechamento */}
      <section className="flex min-h-[50vh] items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-400">Response</p>
      </section>

      {/* Footer - Credits + Links */}
      <section className="flex min-h-[20vh] items-center justify-center">
        <p className="text-zinc-400">Footer</p>
      </section>
    </main>
  )
}
