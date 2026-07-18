import Link from "next/link";

const CHANNELS = [
  {
    icon: "💬",
    title: "WhatsApp",
    text: "Respuesta más rápida para dudas de compras o entregas.",
    action: "+51 999 999 999",
  },
  {
    icon: "✉️",
    title: "Correo",
    text: "Para consultas generales o si quieres vender en TuCarpetero.",
    action: "hola@tucarpetero.com",
  },
  {
    icon: "🕑",
    title: "Horario de atención",
    text: "Lunes a sábado, 10 a.m. – 8 p.m. (hora de Lima).",
    action: null,
  },
];

export default function Contacto() {
  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <h1 className="mb-1 font-display text-lg font-extrabold tracking-tight">
        Contacto
      </h1>
      <p className="mb-5 text-sm text-mut">
        ¿Tienes una duda sobre una compra, una entrega o quieres vender en
        TuCarpetero? Escríbenos.
      </p>

      <div className="mx-auto flex max-w-md flex-col gap-3">
        {CHANNELS.map((c) => (
          <div
            key={c.title}
            className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3.5"
          >
            <span className="text-xl">{c.icon}</span>
            <div>
              <div className="text-[13.5px] font-bold">{c.title}</div>
              <p className="text-[12.5px] text-mut">{c.text}</p>
              {c.action && (
                <div className="mt-1 text-[13px] font-semibold text-vio">{c.action}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-line bg-white px-4 py-4 text-center">
        <p className="text-[13px] text-mut">
          Antes de escribirnos, revisa si tu pregunta ya tiene respuesta.
        </p>
        <Link
          href="/ayuda"
          className="mt-2.5 inline-block rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold"
        >
          Ver centro de ayuda
        </Link>
      </div>
    </main>
  );
}
