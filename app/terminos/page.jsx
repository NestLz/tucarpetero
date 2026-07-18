import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Qué es TuCarpetero.com",
    body: "TuCarpetero.com es un marketplace que conecta a compradores y vendedores ('carpeteros') de cartas coleccionables (Pokémon, Yu-Gi-Oh, Magic: The Gathering) en Lima, Perú. No somos dueños de las cartas publicadas: facilitamos la búsqueda, el pago protegido y la comunicación entre las partes.",
  },
  {
    title: "2. Cuentas y uso de la plataforma",
    body: "Debes dar información veraz al usar la plataforma. No está permitido publicar cartas falsificadas, usar la plataforma para actividades fraudulentas, ni compartir datos de pago fuera de los canales oficiales de TuCarpetero.",
  },
  {
    title: "3. Precios y disponibilidad",
    body: "Los precios de mercado, historial de ventas y disponibilidad mostrados son referenciales y pueden variar. El precio final de una compra es el que aparece en la oferta del carpetero al momento de pagar.",
  },
  {
    title: "4. Pago protegido (escrow)",
    body: "Al confirmar una compra, tu pago queda retenido por TuCarpetero hasta que confirmes la recepción de la carta. Si no confirmas ni disputas dentro de un plazo razonable, el pago se libera automáticamente al carpetero.",
  },
  {
    title: "5. Entregas",
    body: "La 'entrega en tienda certificada' incluye fotografiado y sellado con código único en un Punto Verificado. 'Coordinar directo' es un acuerdo logístico entre comprador y vendedor bajo su propia responsabilidad — TuCarpetero no certifica ni supervisa esas entregas.",
  },
  {
    title: "6. Subastas",
    body: "Las pujas son compromisos de compra vinculantes. Si ganas una subasta, debes completar el pago; si pujan en los últimos 3 minutos, el cierre se extiende automáticamente 3 minutos más (anti-sniping).",
  },
  {
    title: "7. Disputas",
    body: "Si una carta no llega como se describió, puedes abrir una disputa antes de confirmar recepción. TuCarpetero puede mediar entre las partes, pero la resolución final depende de la evidencia que aporte cada uno (fotos, mensajes de chat, etc.).",
  },
  {
    title: "8. Responsabilidad",
    body: "TuCarpetero facilita la conexión entre carpeteros y compradores, pero no garantiza la autenticidad, condición exacta ni el valor de reventa de ninguna carta más allá de lo verificado en el proceso de sellado en tienda certificada.",
  },
  {
    title: "9. Cambios a estos términos",
    body: "Podemos actualizar estos términos conforme la plataforma evoluciona. Te avisaremos de cambios importantes dentro de la propia aplicación.",
  },
];

export default function Terminos() {
  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <h1 className="mb-1 font-display text-lg font-extrabold tracking-tight">
        Términos y condiciones
      </h1>
      <p className="mb-5 text-xs text-mut">Última actualización: julio de 2026</p>

      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="mb-1 text-[13.5px] font-extrabold">{s.title}</h2>
            <p className="text-[13px] leading-relaxed text-mut">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-[12px] text-mut">
        ¿Dudas sobre estos términos?{" "}
        <Link href="/contacto" className="font-semibold text-vio underline underline-offset-2">
          Contáctanos
        </Link>
        .
      </p>
    </main>
  );
}
