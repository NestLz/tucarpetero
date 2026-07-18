import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Busca y compara",
    text: "Filtra por juego, expansión, rareza, condición o precio. Cada carta muestra el precio de mercado y cuántos carpeteros la están vendiendo ahora mismo.",
  },
  {
    n: "02",
    title: "Elige un carpetero",
    text: "Compara precio, reputación, condición e idioma de cada oferta. Los vendedores verificados y las ofertas con fotos reales dan más confianza en cartas caras.",
  },
  {
    n: "03",
    title: "Compra protegida",
    text: "Agrega al carrito y paga con Yape, Plin o tarjeta. Tu dinero queda retenido por la plataforma — no llega al carpetero todavía.",
  },
  {
    n: "04",
    title: "Recibe tu carta",
    text: "Elige entrega en tienda certificada (se fotografía y sella con código único) o coordinar directo con el vendedor bajo su propia responsabilidad.",
  },
  {
    n: "05",
    title: "Confirma y se libera el pago",
    text: "Cuando confirmas que la carta llegó como se describió, recién ahí se libera el pago al carpetero. Si algo no coincide, puedes abrir una disputa antes.",
  },
];

export default function ComoFunciona() {
  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <section className="relative mb-6 overflow-hidden rounded-2xl bg-ink p-5 md:p-10">
        <div
          className="holo absolute inset-0 opacity-[0.18]"
          style={{
            maskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative md:max-w-xl">
          <h1 className="font-display text-[21px] font-extrabold leading-tight text-white md:text-[32px]">
            Cómo <span className="holo-text">funciona</span>
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-white/70 md:text-[15px]">
            De buscar una carta a recibirla en tus manos, con tu pago protegido
            en cada paso.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {STEPS.map((s) => (
          <section
            key={s.n}
            className="flex gap-4 rounded-2xl border border-line bg-white px-4 py-4"
          >
            <span className="holo-text shrink-0 font-display text-2xl font-extrabold">
              {s.n}
            </span>
            <div>
              <h2 className="font-display text-[15px] font-extrabold">{s.title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-mut">{s.text}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 rounded-2xl border border-teal/30 bg-teal/5 px-4 py-4 text-[12.5px] leading-relaxed text-mut sm:flex-row sm:items-center sm:justify-between">
        <span>
          🛡 <b className="text-body">Escrow:</b> tu pago se libera al carpetero
          solo cuando tú confirmas la recepción, nunca antes.
        </span>
        <Link
          href="/ayuda"
          className="shrink-0 rounded-full border border-line bg-white px-3.5 py-1.5 text-center text-[12px] font-bold"
        >
          Ver preguntas frecuentes
        </Link>
      </div>
    </main>
  );
}
