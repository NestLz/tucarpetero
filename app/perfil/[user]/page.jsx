import { notFound } from "next/navigation";
import { SELLERS } from "@/lib/data";
import PerfilClient from "./PerfilClient";

// Server Component: la búsqueda del vendedor y el notFound() corren en el
// servidor, así el 404 llega con el status HTTP correcto.
export default async function Perfil({ params }) {
  const { user } = await params;
  const seller = SELLERS[user];
  if (!seller) notFound();

  return <PerfilClient seller={seller} />;
}
