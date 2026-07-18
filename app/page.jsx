"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CARDS,
  TCG_COLORS,
  DEFAULT_OFFERS,
  AUCTIONS,
  SETS_BY_TCG,
  CONDITIONS,
  offersFor,
  setDateLabel,
  soles,
} from "@/lib/data";
import { CardArt } from "@/components/ui";
import { useFavorites } from "@/components/FavoritesContext";

const TCGS = ["Todos", "Pokémon", "Yu-Gi-Oh", "Magic"];

// timestamp que se actualiza cada segundo, para calcular countdowns en vivo
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const AUCTION_ROTATE_MS = 4000;
const AUCTION_TRANSITION_MS = 500;

// hace un "barrido" hacia arriba entre 0..length-1 y vuelve a 0 sin salto visible
function useCarouselIndex(length) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (length <= 1) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, AUCTION_ROTATE_MS);
    return () => clearInterval(id);
  }, [length]);

  useEffect(() => {
    if (index !== length) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, AUCTION_TRANSITION_MS);
    return () => clearTimeout(t);
  }, [index, length]);

  return { index, animate };
}

function fmtCountdown(totalSeconds) {
  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
const SORTS = [
  { id: "relevancia", label: "Relevancia" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
  { id: "ofertas", label: "Más ofertas" },
  { id: "az", label: "Nombre: A-Z" },
  { id: "za", label: "Nombre: Z-A" },
];

const DELIVERY_OPTIONS = [
  { id: "tienda", label: "🏪 Entrega en tienda" },
  { id: "coordinar", label: "🤝 Coordinar directo" },
];

// precio de "desde S/X" como número, para filtrar por rango
const cardPricePEN = (c) => Math.max(2, Math.round(c.refUsd * 0.8 * 3.75));

function FilterDropdown({ label, count = 0, isOpen, onToggle, onClose, widthClass = "w-60", children }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition ${
          isOpen || count > 0
            ? "border-vio/50 bg-vio/5 text-vio"
            : "border-line bg-white text-body hover:border-vio/30"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-vio px-1 text-[10px] font-extrabold text-white">
            {count}
          </span>
        )}
        <span className={`text-[9px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div
            className={`absolute left-0 top-full z-50 mt-2 ${widthClass} rounded-2xl border border-line bg-white p-3 shadow-xl`}
          >
            <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">{children}</div>
          </div>
        </>
      )}
    </div>
  );
}

function RadioRow({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition ${
        active ? "bg-vio/10 font-bold text-vio" : "text-mut hover:bg-paper hover:text-body"
      }`}
    >
      <span
        className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
          active ? "border-vio bg-vio" : "border-line"
        }`}
      />
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

function ExpansionRow({ active, name, date, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition ${
        active ? "bg-vio/10 text-vio" : "text-mut hover:bg-paper hover:text-body"
      }`}
    >
      <span
        className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
          active ? "border-vio bg-vio" : "border-line"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className={`block truncate ${active ? "font-bold" : ""}`}>{name}</span>
        {date && <span className="block text-[11px] text-mut">{date}</span>}
      </span>
    </button>
  );
}

function CheckRow({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition ${
        active ? "bg-vio/10 font-bold text-vio" : "text-mut hover:bg-paper hover:text-body"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border-2 ${
          active ? "border-vio bg-vio text-white" : "border-line"
        }`}
      >
        {active && <span className="text-[9px] leading-none">✓</span>}
      </span>
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

function ToggleRow({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] font-semibold text-body transition hover:bg-paper"
    >
      {children}
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${active ? "bg-vio" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function FilterSectionLabel({ children }) {
  return (
    <div className="mb-1 mt-2.5 px-2 text-[10px] font-bold uppercase tracking-wide text-mut first:mt-0">
      {children}
    </div>
  );
}

function BuscarInner() {
  const searchParams = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");

  // si llegamos de nuevo con ?q= distinto (ej. otra búsqueda desde el
  // header estando ya en el home), sincroniza sin pisar lo que se escribe
  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ && urlQ !== q) setQ(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const [tcg, setTcg] = useState("Todos");
  const [setFilter, setSetFilter] = useState("Todas");
  const [rarityFilters, setRarityFilters] = useState(new Set());
  const [conditionFilters, setConditionFilters] = useState(new Set());
  const [langFilters, setLangFilters] = useState(new Set());
  const [deliveryFilters, setDeliveryFilters] = useState(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");
  const [openFilter, setOpenFilter] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleFilter = (name) => setOpenFilter((cur) => (cur === name ? null : name));
  const closeFilter = () => setOpenFilter(null);

  const toggleInSet = (setter, value) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const handleTcg = (t) => {
    setTcg(t);
    setSetFilter("Todas");
    setRarityFilters(new Set());
    closeFilter();
  };

  const toggleRarity = (r) => toggleInSet(setRarityFilters, r);
  const toggleCondition = (c) => toggleInSet(setConditionFilters, c);
  const toggleLang = (l) => toggleInSet(setLangFilters, l);
  const toggleDelivery = (d) => toggleInSet(setDeliveryFilters, d);

  const currentSets = SETS_BY_TCG[tcg] ?? [];

  const bySearch = useMemo(
    () =>
      CARDS.filter(
        (c) => (tcg === "Todos" || c.tcg === tcg) && c.name.toLowerCase().includes(q.toLowerCase())
      ),
    [q, tcg]
  );

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    return CARDS.filter((c) => c.name.toLowerCase().includes(ql)).slice(0, 6);
  }, [q]);

  const availableRarities = useMemo(
    () => [...new Set(bySearch.map((c) => c.rarity))].sort(),
    [bySearch]
  );

  const list = useMemo(() => {
    const minP = priceMin === "" ? -Infinity : Number(priceMin);
    const maxP = priceMax === "" ? Infinity : Number(priceMax);
    const needsOfferCheck =
      conditionFilters.size > 0 || langFilters.size > 0 || deliveryFilters.size > 0 || verifiedOnly;

    const filtered = bySearch.filter((c) => {
      if (currentSets.length > 0 && setFilter !== "Todas" && c.setId !== setFilter) return false;
      if (rarityFilters.size > 0 && !rarityFilters.has(c.rarity)) return false;

      const price = cardPricePEN(c);
      if (price < minP || price > maxP) return false;

      if (needsOfferCheck) {
        const offers = offersFor(c);
        if (conditionFilters.size > 0 && !offers.some((o) => conditionFilters.has(o.cond)))
          return false;
        if (langFilters.size > 0 && !offers.some((o) => langFilters.has(o.lang))) return false;
        if (
          deliveryFilters.size > 0 &&
          !offers.some((o) => o.delivery.some((d) => deliveryFilters.has(d)))
        )
          return false;
        if (verifiedOnly && !offers.some((o) => o.verified)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "precio-asc") sorted.sort((a, b) => a.refUsd - b.refUsd);
    else if (sortBy === "precio-desc") sorted.sort((a, b) => b.refUsd - a.refUsd);
    else if (sortBy === "ofertas") sorted.sort((a, b) => offersFor(b).length - offersFor(a).length);
    else if (sortBy === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    return sorted;
  }, [
    bySearch,
    tcg,
    setFilter,
    rarityFilters,
    conditionFilters,
    langFilters,
    deliveryFilters,
    verifiedOnly,
    priceMin,
    priceMax,
    sortBy,
    currentSets,
  ]);

  const moreFiltersCount = langFilters.size + deliveryFilters.size + (verifiedOnly ? 1 : 0);

  const activeCount =
    (tcg !== "Todos" ? 1 : 0) +
    (setFilter !== "Todas" ? 1 : 0) +
    rarityFilters.size +
    conditionFilters.size +
    moreFiltersCount +
    (priceMin !== "" || priceMax !== "" ? 1 : 0) +
    (sortBy !== "relevancia" ? 1 : 0);

  const now = useNow();
  const auctionEndsAt = useMemo(
    () => AUCTIONS.map((a) => Date.now() + a.endsInMin * 60 * 1000),
    []
  );
  const { index: auctionIndex, animate: auctionAnimate } = useCarouselIndex(AUCTIONS.length);
  // el primer elemento se repite al final para que el barrido no "salte" al reiniciar
  const auctionSlides = [...AUCTIONS, AUCTIONS[0]];

  const clearAll = () => {
    setTcg("Todos");
    setSetFilter("Todas");
    setRarityFilters(new Set());
    setConditionFilters(new Set());
    setLangFilters(new Set());
    setDeliveryFilters(new Set());
    setVerifiedOnly(false);
    setPriceMin("");
    setPriceMax("");
    setSortBy("relevancia");
    closeFilter();
  };

  return (
    <main>
      <header className="mb-4 flex items-center justify-between md:hidden">
        <span className="font-display text-lg font-extrabold tracking-tight">
          Tu<span className="holo-text">Carpetero</span>.com
        </span>
        <span className="rounded-full border border-line px-2.5 py-[3px] text-[11px] font-semibold text-mut">
          Lima · beta
        </span>
      </header>

      {/* hero */}
      <section className="relative mb-4 overflow-hidden rounded-2xl bg-ink p-5 md:mb-6 md:p-10">
        <div
          className="holo absolute inset-0 opacity-[0.18]"
          style={{
            maskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(80% 120% at 85% 0%, #000 0%, transparent 60%)",
          }}
        />
        <div className="relative md:max-w-xl">
          <h1 className="font-display text-[21px] font-extrabold leading-tight text-white md:text-[34px]">
            Busca la carta.
            <br />
            <span className="holo-text">Compara carpeteros.</span>
          </h1>
          <div className="relative mt-3.5 md:mt-6">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Charizard, Sol Ring, Blue-Eyes…"
              className="w-full rounded-xl bg-white px-3.5 py-3 text-sm outline-none md:py-3.5 md:text-[15px]"
            />

            {searchFocused && suggestions.length > 0 && (
              <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
                {suggestions.map((c) => (
                  <Link
                    key={c.id}
                    href={`/carta/${c.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 text-left transition hover:bg-paper"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line text-base"
                      style={{
                        background: `linear-gradient(160deg, ${TCG_COLORS[c.tcg]}22, #F7F8FB)`,
                      }}
                    >
                      <CardArt src={c.img} alt={c.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-bold text-body">{c.name}</div>
                      <div className="truncate text-[10.5px] text-mut">
                        {c.tcg} · {c.set}
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold text-teal">
                      desde {soles(c.refUsd * 0.8)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* subasta destacada — gatillo mental de urgencia, con barrido entre subastas */}
      <Link
        href="/subastas"
        className="group relative mb-4 block overflow-hidden rounded-2xl border border-amber/50 bg-ink transition hover:border-amber md:mb-6"
      >
        <div className="holo pointer-events-none absolute inset-0 z-10 opacity-[0.12]" />

        <div className="relative h-20 overflow-hidden">
          <div
            className="flex flex-col"
            style={{
              transform: `translateY(-${(auctionIndex / auctionSlides.length) * 100}%)`,
              transition: auctionAnimate ? `transform ${AUCTION_TRANSITION_MS}ms ease` : "none",
            }}
          >
            {auctionSlides.map((a, i) => {
              const card = CARDS.find((c) => c.id === a.cardId);
              const secondsLeft = Math.max(
                0,
                Math.round((auctionEndsAt[i % AUCTIONS.length] - now) / 1000)
              );
              return (
                <div key={i} className="flex h-20 shrink-0 items-center gap-3 px-4 sm:px-5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>

                  <div
                    className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/15 text-xl"
                    style={{
                      background: `linear-gradient(160deg, ${TCG_COLORS[card.tcg]}44, #1C2438)`,
                    }}
                  >
                    <CardArt src={card.img} alt={card.name} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-extrabold text-white sm:text-[13.5px]">
                      {card.name}
                    </div>
                    <div className="truncate text-[11px] text-white/60">
                      <span className="hidden sm:inline">Puja actual </span>S/ {a.current} ·{" "}
                      {a.bids} pujas
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="hidden text-[10px] font-semibold uppercase tracking-wide text-white/50 sm:block">
                      Termina en
                    </div>
                    <div className="font-display text-base font-extrabold tabular-nums text-[#FFD166] sm:text-lg">
                      {fmtCountdown(secondsLeft)}
                    </div>
                  </div>

                  <span className="holo shrink-0 rounded-full px-2.5 py-2 text-[12px] font-extrabold text-white transition group-hover:brightness-110 sm:px-3.5">
                    <span className="hidden sm:inline">Pujar ahora </span>→
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Link>

      {/* barra de filtros */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Juego"
          count={tcg !== "Todos" ? 1 : 0}
          isOpen={openFilter === "juego"}
          onToggle={() => toggleFilter("juego")}
          onClose={closeFilter}
          widthClass="w-44"
        >
          {TCGS.map((t) => (
            <RadioRow key={t} active={tcg === t} onClick={() => handleTcg(t)}>
              {t}
            </RadioRow>
          ))}
        </FilterDropdown>

        {currentSets.length > 0 && (
          <FilterDropdown
            label="Expansión"
            count={setFilter !== "Todas" ? 1 : 0}
            isOpen={openFilter === "expansion"}
            onToggle={() => toggleFilter("expansion")}
            onClose={closeFilter}
            widthClass="w-72"
          >
            <RadioRow
              active={setFilter === "Todas"}
              onClick={() => {
                setSetFilter("Todas");
                closeFilter();
              }}
            >
              Todas las expansiones
            </RadioRow>
            {currentSets.map((s) => (
              <ExpansionRow
                key={s.id}
                active={setFilter === s.id}
                name={s.name}
                date={setDateLabel(s.releaseDate)}
                onClick={() => {
                  setSetFilter(s.id);
                  closeFilter();
                }}
              />
            ))}
          </FilterDropdown>
        )}

        {tcg !== "Todos" && availableRarities.length > 1 && (
          <FilterDropdown
            label="Rareza"
            count={rarityFilters.size}
            isOpen={openFilter === "rareza"}
            onToggle={() => toggleFilter("rareza")}
            onClose={closeFilter}
            widthClass="w-64"
          >
            {availableRarities.map((r) => (
              <CheckRow key={r} active={rarityFilters.has(r)} onClick={() => toggleRarity(r)}>
                {r}
              </CheckRow>
            ))}
          </FilterDropdown>
        )}

        <FilterDropdown
          label="Condición"
          count={conditionFilters.size}
          isOpen={openFilter === "condicion"}
          onToggle={() => toggleFilter("condicion")}
          onClose={closeFilter}
          widthClass="w-64"
        >
          {CONDITIONS.map((c) => (
            <CheckRow
              key={c.id}
              active={conditionFilters.has(c.label)}
              onClick={() => toggleCondition(c.label)}
            >
              {c.label}
            </CheckRow>
          ))}
        </FilterDropdown>

        <FilterDropdown
          label="Precio"
          count={priceMin !== "" || priceMax !== "" ? 1 : 0}
          isOpen={openFilter === "precio"}
          onToggle={() => toggleFilter("precio")}
          onClose={closeFilter}
          widthClass="w-56"
        >
          <div className="px-1 py-1">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-mut">
              Rango en soles
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Mín."
                className="w-full rounded-lg border border-line px-2.5 py-1.5 text-[12.5px] outline-none focus:border-vio"
              />
              <span className="text-mut">–</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Máx."
                className="w-full rounded-lg border border-line px-2.5 py-1.5 text-[12.5px] outline-none focus:border-vio"
              />
            </div>
          </div>
        </FilterDropdown>

        <FilterDropdown
          label="Más filtros"
          count={moreFiltersCount}
          isOpen={openFilter === "mas"}
          onToggle={() => toggleFilter("mas")}
          onClose={closeFilter}
          widthClass="w-64"
        >
          <ToggleRow active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
            ✓ Solo carpeteros verificados
          </ToggleRow>

          <FilterSectionLabel>Idioma</FilterSectionLabel>
          {["Inglés", "Español"].map((l) => (
            <CheckRow key={l} active={langFilters.has(l)} onClick={() => toggleLang(l)}>
              {l}
            </CheckRow>
          ))}

          <FilterSectionLabel>Entrega</FilterSectionLabel>
          {DELIVERY_OPTIONS.map((d) => (
            <CheckRow
              key={d.id}
              active={deliveryFilters.has(d.id)}
              onClick={() => toggleDelivery(d.id)}
            >
              {d.label}
            </CheckRow>
          ))}
        </FilterDropdown>

        <FilterDropdown
          label="Ordenar"
          count={sortBy !== "relevancia" ? 1 : 0}
          isOpen={openFilter === "orden"}
          onToggle={() => toggleFilter("orden")}
          onClose={closeFilter}
          widthClass="w-56"
        >
          {SORTS.map((s) => (
            <RadioRow
              key={s.id}
              active={sortBy === s.id}
              onClick={() => {
                setSortBy(s.id);
                closeFilter();
              }}
            >
              {s.label}
            </RadioRow>
          ))}
        </FilterDropdown>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[12.5px] font-semibold text-mut underline decoration-line underline-offset-2 hover:text-vio"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="mb-2.5 px-0.5 text-xs font-semibold text-mut md:mb-4 md:text-sm">
        {list.length} cartas · precios de referencia según mercado internacional
      </p>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/carta/${c.id}`}
            className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className="relative flex h-24 items-center justify-center border-b border-line text-4xl md:h-32 md:text-5xl"
              style={{
                background: `linear-gradient(160deg, ${TCG_COLORS[c.tcg]}22, #F7F8FB)`,
              }}
            >
              <CardArt src={c.img} alt={c.name} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(c.id);
                }}
                aria-label={isFavorite(c.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-sm backdrop-blur transition ${
                  isFavorite(c.id) ? "text-red-500" : "text-mut hover:text-red-400"
                }`}
              >
                {isFavorite(c.id) ? "♥" : "♡"}
              </button>
            </div>
            <div className="p-3">
              <div
                className="text-[10.5px] font-bold uppercase tracking-wide"
                style={{ color: TCG_COLORS[c.tcg] }}
              >
                {c.tcg}
              </div>
              <div className="my-0.5 truncate text-[13.5px] font-bold">{c.name}</div>
              <div className="truncate text-[11px] text-mut">
                {c.set} · {c.rarity} · {c.num}
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-sm font-extrabold">desde {soles(c.refUsd * 0.8)}</div>
                  <div className="text-[10px] text-mut">Ref. ${c.refUsd.toFixed(2)}</div>
                </div>
                <span className="text-[11px] font-bold text-teal">
                  {DEFAULT_OFFERS.length} ofertas
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {list.length === 0 && (
        <p className="mt-10 text-center text-sm text-mut">
          No encontramos cartas con esos filtros. Prueba quitando alguno.
        </p>
      )}
    </main>
  );
}

export default function Buscar() {
  return (
    <Suspense fallback={null}>
      <BuscarInner />
    </Suspense>
  );
}
