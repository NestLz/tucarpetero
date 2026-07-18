import { notFound } from "next/navigation";
import { CARDS } from "@/lib/data";
import CartaClient from "./CartaClient";

// Server Component: la búsqueda de la carta y el notFound() corren en el
// servidor, así el 404 llega con el status HTTP correcto (no depende de
// que el cliente hidrate para decidirlo).
export default async function Carta({ params }) {
  const { id } = await params;
  const card = CARDS.find((c) => c.id === id);
  if (!card) notFound();

  return <CartaClient card={card} />;
}
