"use client";

// Komponenten kører på klientsiden, fordi den bruger React-state og reagerer på brugerens klik, tastetryk og musebevægelser.

// useState bruges til at gemme og opdatere værdier, når brugeren søger.
import { useState } from "react";

// Supabase bruges til at hente søgeresultater fra databasen.
import { supabase } from "@/lib/supabase"; 

// Next.js Image bruges til at vise billeder af kunstnere, events og spillesteder.
import Image from "next/image";

// CSS-modulet indeholder styling til søgefeltet og resultaterne.
import styles from "./Header.module.css";

// Link bruges til at navigere til andre sider uden en fuld genindlæsning.
import Link from "next/link";

// Her starter komponenten, som styrer hele søgefunktionen.
export default function Soegning() {
  const [soegeord, setSoegeord] = useState(""); // Gemmer den tekst, brugeren skriver i søgefeltet.
  const [kunstnere, setKunstnere] = useState([]); // Gemmer listen over kunstnere, der matcher søgningen.
  const [aaben, setAaben] = useState(false); // Holder styr på, om søgepanelet er åbent eller lukket.
  const [eventResultater, setEventResultater] = useState([]); // Gemmer de events, som bliver fundet.
  const [spillesteder, setSpillesteder] = useState([]); // Gemmer de spillesteder, der matcher søgningen.
  const [valgtSoegeforslag, setValgtSoegeforslag] = useState(""); // Holder styr på, hvilket populært søgeforslag der er valgt.

  // Henter kunstnere fra databasen ud fra den tekst, brugeren har skrevet.
  async function hentKunstnere(tekst) {
    if (tekst.trim().length < 2) {
      // Vi søger først, når brugeren har skrevet mindst to tegn.
      setKunstnere([]);
      return;
    }

    // Sender en forespørgsel til Supabase og modtager data eller en fejl.
    const { data, error } = await supabase
      .from("event")
      .select("kunstner, detalje_image_url")
      .not("kunstner", "is", null)
      .ilike("kunstner", `%${tekst}%`);

    // Hvis forespørgslen fejler, skriver vi fejlen i konsollen.
    if (error) {
      console.error("Kunne ikke hente kunstnere:", error);
      return;
    }

    const unikkeKunstnere = new Map();

    for (const raekke of data ?? []) {
      if (!raekke.kunstner) continue;

      const gemtKunstner = unikkeKunstnere.get(raekke.kunstner);

      if (!gemtKunstner?.detalje_image_url) {
        unikkeKunstnere.set(raekke.kunstner, raekke);
      }
    }

    setKunstnere([...unikkeKunstnere.values()]);
  }

  // Henter events, hvor titlen indeholder søgeteksten.
  async function hentEvents(tekst) {
    if (tekst.trim().length < 2) {
      // Vi søger først, når brugeren har skrevet mindst to tegn.
      setEventResultater([]);
      return;
    }

    // Sender en forespørgsel til Supabase og modtager data eller en fejl.
    const { data, error } = await supabase
      .from("event")
      .select("id, titel, detalje_image_url, starts_at, spillested, by")
      .ilike("titel", `%${tekst}%`)
      .order("starts_at", { ascending: true })
      .limit(3);

    // Hvis forespørgslen fejler, skriver vi fejlen i konsollen.
    if (error) {
      console.error("Kunne ikke hente events:", error);
      return;
    }

    console.table(data);
    setEventResultater(data ?? []);
  }

  // Henter spillesteder, som matcher søgeteksten.
  async function hentSpillesteder(tekst) {
    if (tekst.trim().length < 2) {
      // Vi søger først, når brugeren har skrevet mindst to tegn.
      setSpillesteder([]);
      return;
    }

    // Sender en forespørgsel til Supabase og modtager data eller en fejl.
    const { data, error } = await supabase
      .from("event")
      .select("spillested, by, detalje_image_url")
      .not("spillested", "is", null)
      .ilike("spillested", `%${tekst}%`);

    // Hvis forespørgslen fejler, skriver vi fejlen i konsollen.
    if (error) {
      console.error("Kunne ikke hente spillesteder:", error);
      return;
    }

    const unikkeSpillesteder = [
      ...new Map(
        (data ?? [])
          .filter((raekke) => raekke.spillested)
          .map((raekke) => [`${raekke.spillested}-${raekke.by}`, raekke]),
      ).values(),
    ];

    setSpillesteder(unikkeSpillesteder);
  }

  // Her bygges den del af søgningen, som brugeren kan se og bruge.
  return (
    <div
      className={styles.searchItem}
      onMouseEnter={() => setAaben(true)}
      onMouseLeave={() => setAaben(false)}
    >
      <button
        type="button"
        className={styles.iconLink}
        aria-label="Åbn søgning"
        aria-expanded={aaben}
        onClick={() => setAaben(true)}
      >
        <Image src="/assets/icons/søg.svg" alt="" width={32} height={32} />
      </button>

      {aaben && (
        <div className={styles.searchPanel}>
          <h2 className={styles.searchHeading}>
            {soegeord.trim().length >= 2
              ? `Søgeresultater for “${soegeord}” · ${
                  kunstnere.length +
                  eventResultater.length +
                  spillesteder.length
                } resultater`
              : "Søg efter kunstnere, events og spillesteder"}
          </h2>

          <div className={styles.searchFieldRow}>
            <div className={styles.searchField}>
              <input
                value={soegeord}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                onChange={(event) => {
                  const tekst = event.target.value;
                  setSoegeord(tekst);
                  hentKunstnere(tekst);
                  hentEvents(tekst);
                  hentSpillesteder(tekst);
                }}
                placeholder="Søg efter en kunstner"
              />

              <button
                type="button"
                aria-label="Ryd søgning"
                onClick={() => {
                  setSoegeord("");
                  setKunstnere([]);
                  setEventResultater([]);
                  setSpillesteder([]);
                  setValgtSoegeforslag("");
                }}
              >
                ×
              </button>
            </div>
            <button type="button" onClick={() => setAaben(false)}>
              Luk
            </button>
          </div>

          <div className={styles.searchColumns}>
            <section className={styles.artistResults}>
              <h2>
                KUNSTNERE · <span>{kunstnere.length}</span>
              </h2>
              <ul>
                {kunstnere.map((kunstner) => (
                  <li className={styles.artistCard} key={kunstner}>
                    {kunstner.detalje_image_url ? (
                      <Image
                        src={kunstner.detalje_image_url}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.artistPlaceholder}
                      />
                    ) : (
                      <span
                        className={styles.artistPlaceholder}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.artistInfo}>
                      <strong>{kunstner.kunstner}</strong>
                      <small>Kunstner</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.eventResults}>
              <h2>
                EVENTS · <span>{eventResultater.length}</span>
              </h2>

              <ul>
                {eventResultater.map((event) => (
                  <li key={event.id}>
                    {event.detalje_image_url ? (
                      <Image
                        src={event.detalje_image_url}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.eventPlaceholder}
                      />
                    ) : (
                      <span
                        className={styles.eventPlaceholder}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.eventInfo}>
                      <strong>{event.titel}</strong>
                      <small>
                        {new Date(event.starts_at).toLocaleDateString("da-DK", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" · "}
                        {event.spillested}, {event.by}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className={styles.eventResults}>
              <h2>
                SPILLESTEDER · <span>{spillesteder.length}</span>
              </h2>

              <ul>
                {spillesteder.map((sted) => (
                  <li key={`${sted.spillested}-${sted.by}`}>
                    {sted.detalje_image_url ? (
                      <Image
                        src={sted.detalje_image_url}
                        alt=""
                        width={44}
                        height={44}
                        className={styles.eventPlaceholder}
                      />
                    ) : (
                      <span
                        className={styles.eventPlaceholder}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.eventInfo}>
                      <strong>{sted.spillested}</strong>
                      <small>{sted.by}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className={styles.popularSearches}>
            <span>POPULÆRT:</span>

            {["Koncert", "Gilli", "Anne Linnet", "Jul", "Hugorm"].map(
              (titel) => (
                <button
                  className={
                    valgtSoegeforslag === titel
                      ? styles.popularSearchActive
                      : ""
                  }
                  key={titel}
                  type="button"
                  onClick={() => {
                    setSoegeord(titel);
                    hentKunstnere(titel);
                    hentEvents(titel);
                    hentSpillesteder(titel);
                    setValgtSoegeforslag((valgt) =>
                      valgt === titel ? "" : titel,
                    );
                  }}
                >
                  {titel}
                </button>
              ),
            )}
          </div>
          <hr className={styles.searchDivider} />
          <div className={styles.searchActions}>
            <Link
              href="/kategori/musik"
              className={styles.allResultsButton}
              style={{
                backgroundColor:
                  kunstnere.length +
                    eventResultater.length +
                    spillesteder.length ===
                  0
                    ? "var(--color-border)"
                    : undefined,
              }}
              onClick={() => setAaben(false)}
            >
              Se{" "}
              {kunstnere.length + eventResultater.length + spillesteder.length}{" "}
              resultater
            </Link>

            <Link
              href="/eventgenerator"
              className={styles.eventGeneratorButton}
              onClick={() => setAaben(false)}
            >
              Ved du ikke, hvad du leder efter? Prøv Eventgenerator
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}