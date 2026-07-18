import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Qué datos usamos",
    body: "Para operar la plataforma necesitamos datos como tu nombre, contacto, dirección o punto de entrega preferido, historial de compras y mensajes de chat con carpeteros. Los mensajes de pago (Yape, Plin, tarjeta) los procesa nuestra pasarela de pago — TuCarpetero no almacena tus datos bancarios completos.",
  },
  {
    title: "2. Qué guardamos en tu navegador",
    body: "Tu carrito, tus favoritos y tus conversaciones de chat se guardan localmente en tu navegador (localStorage) para que no se pierdan al recargar la página. Esta información vive en tu dispositivo — hoy no se envía a nuestros servidores, así que si limpias los datos del navegador, se pierde.",
  },
  {
    title: "3. Para qué usamos tus datos",
    body: "Usamos tus datos para procesar compras, coordinar entregas, prevenir fraude, y mejorar la plataforma. No vendemos tu información a terceros.",
  },
  {
    title: "4. Con quién compartimos información",
    body: "Compartimos lo estrictamente necesario con el carpetero con el que estás transaccionando (nombre de usuario, punto de entrega si aplica) y con nuestra pasarela de pagos para procesar el cobro. No compartimos tus datos con fines publicitarios de terceros.",
  },
  {
    title: "5. Tus derechos",
    body: "Puedes pedirnos acceder, corregir o eliminar tus datos personales en cualquier momento escribiéndonos desde la página de Contacto.",
  },
  {
    title: "6. Cambios a esta política",
    body: "Si actualizamos esta política de forma relevante, te lo notificaremos dentro de la aplicación.",
  },
];

export default function Privacidad() {
  return (
    <main>
      <Link href="/" className="mb-3 inline-block text-xs font-semibold text-mut">
        ← Volver
      </Link>

      <h1 className="mb-1 font-display text-lg font-extrabold tracking-tight">
        Política de privacidad
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
        ¿Dudas sobre tus datos?{" "}
        <Link href="/contacto" className="font-semibold text-vio underline underline-offset-2">
          Contáctanos
        </Link>
        .
      </p>
    </main>
  );
}
