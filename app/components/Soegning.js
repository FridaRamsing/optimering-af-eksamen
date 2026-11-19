"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Soegning() {
  const [soegeord, setSoegeord] = useState("");
  const [kunstnere, setKunstnere] = useState([]);
  const [aaben, setAaben] = useState(false);
  const [eventResultater, setEventResultater] = useState([]);
  const [spillesteder, setSpillesteder] = useState([]);
  const [valgtSoegeforslag, setValgtSoegeforslag] = useState("");

  async function hentKunstnere(tekst) {
    if (tekst.trim().length < 2) {
      setKunstnere([]);
      return;
    }

    const { data, error } = await supabase
      .from("event")
      .select("kunstner")
      .not("kunstner", "is", null)
      .ilike("kunstner", `%${tekst}%`);

    if (error) {
      console.error("Kunne ikke hente kunstnere:", error);
      return;
    }

    const unikkeNavne = [
      ...new Set((data ?? []).map((raekke) => raekke.kunstner).filter(Boolean)),
    ];

    setKunstnere(unikkeNavne);
  }

  async function hentEvents(tekst) {
    if (tekst.trim().length < 2) {
      setEventResultater([]);
      return;
    }

    const { data, error } = await supabase
      .from("event")
      .select("id, titel, card_image_url, starts_at, spillested, by")
      .ilike("titel", `%${tekst}%`)
      .order("starts_at", { ascending: true })
      .limit(3);

    if (error) {
      console.error("Kunne ikke hente events:", error);
      return;
    }

    setEventResultater(data ?? []);
  }

  async function hentSpillesteder(tekst) {
    if (tekst.trim().length < 2) {
      setSpillesteder([]);
      return;
    }

    const { data, error } = await supabase
      .from("event")
      .select("spillested, by")
      .not("spillested", "is", null)
      .ilike("spillested", `%${tekst}%`);

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
          {(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
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

          <div className={styles.searchColumns}>
            <section className={styles.artistResults}>
              <h2>
                KUNSTNERE · <span>{kunstnere.length}</span>
              </h2>
              <ul>
                {kunstnere.map((kunstner) => (
                  <li className={styles.artistCard} key={kunstner}>
                    <span
                      className={styles.artistPlaceholder}
                      aria-hidden="true"
                    />
                    <span className={styles.artistInfo}>
                      <strong>{kunstner}</strong>
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
                    <span
                      className={styles.eventPlaceholder}
                      aria-hidden="true"
                    />
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
                    <span
                      className={styles.eventPlaceholder}
                      aria-hidden="true"
                    />
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
            <button type="button" className={styles.allResultsButton}>
              Se alle resultater
            </button>

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