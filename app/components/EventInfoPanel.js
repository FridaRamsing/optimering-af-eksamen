

"use client";

import { useRef } from "react";
import Image from "next/image";
import styles from "./EventInfoPanel.module.css";

// "linje1\nlinje2" → ["linje1", "linje2"]
function linjer(tekst) {
  return tekst?.split("\n").filter(Boolean) ?? [];
}

// "Dørene åbner kl. 18.30" → { tid: "18.30", tekst: "Dørene åbner" }
function tidspunkt(linje) {
  const tid = linje.match(/\d{1,2}[.:]\d{2}/)?.[0];
  const tekst = linje.replace(/(kl\.\s*)?\d{1,2}[.:]\d{2}/, "").trim();
  // Selve showet fremhæves med en stjerne
  const hoved = /starter|begynder|scenen/i.test(linje);
  return { tid, tekst, hoved };
}

// Sektion, der kun vises, hvis der er tekst i Supabase
function Sektion({ titel, children, tekst }) {
  if (!tekst) return null;
  return (
    <section className={styles.sektion}>
      <h3 className={styles.sektionTitel}>{titel}</h3>
      {children}
    </section>
  );
}

export default function EventInfoPanel({ event, datoTekst }) {
  const dialogRef = useRef(null);

  function aaben() {
    dialogRef.current.showModal();
  }

  function luk() {
    dialogRef.current.close();
  }

  // Klik på det mørke område uden for panelet lukker det
  function klikUdenfor(e) {
    if (e.target === dialogRef.current) luk();
  }

  const pris = event.pris_fra.toLocaleString("da-DK");

  return (
    <>
      <button type="button" className={styles.laesMere} onClick={aaben}>
        Læs mere
      </button>

      <dialog
        ref={dialogRef}
        className={styles.panel}
        aria-labelledby="panel-titel"
        onClick={klikUdenfor}
      >
        <div className={styles.indre}>
          <header className={styles.top}>
            <h2 id="panel-titel" className={styles.topTitel}>
              Eventinformation
            </h2>
            <button
              type="button"
              className={styles.luk}
              onClick={luk}
              aria-label="Luk"
            >
              <Image
                src="/assets/icons/luk.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </header>

          <div className={styles.indhold}>
            <div className={styles.event}>
              <div className={styles.thumb}>
                <Image
                  src={event.detalje_image_url}
                  alt=""
                  fill
                  sizes="80px"
                  className={styles.thumbBillede}
                />
              </div>
              <div>
                <p className={styles.kategori}>
                  {event.kategori}
                  {event.genre && ` · ${event.genre}`}
                </p>
                <p className={styles.titel}>{event.titel}</p>
              </div>
            </div>

            <ul className={styles.fakta}>
              <li>
                <Image
                  src="/assets/icons/kalender.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                {datoTekst}
              </li>
              <li>
                <Image
                  src="/assets/icons/sted.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                {event.spillested}, {event.by}
              </li>
            </ul>

            <Sektion titel="Om eventet" tekst={event.beskrivelse}>
              <p>{event.beskrivelse}</p>
            </Sektion>

            <Sektion titel="Om kunstneren" tekst={event.om_kunstner}>
              <p>{event.om_kunstner}</p>
            </Sektion>

            <Sektion titel="Tidsplan" tekst={event.tidsplan}>
              <ul className={styles.tidsplan}>
                {linjer(event.tidsplan).map((linje) => {
                  const { tid, tekst, hoved } = tidspunkt(linje);
                  return (
                    <li key={linje} className={hoved ? styles.hoved : ""}>
                      <span className={styles.tid}>{tid}</span>
                      <span className={styles.prik} aria-hidden="true">
                        {hoved ? "✦" : "●"}
                      </span>
                      <span>{tekst}</span>
                    </li>
                  );
                })}
              </ul>
            </Sektion>

            <Sektion titel="Billetter" tekst={event.billetter}>
              <ul className={styles.punkter}>
                {linjer(event.billetter).map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Sektion>

            <Sektion titel="Praktisk information" tekst={event.praktisk_info}>
              <ul className={styles.punkter}>
                {linjer(event.praktisk_info).map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Sektion>

            <Sektion titel="Tilgængelighed" tekst={event.tilgængelighed}>
              <p>{event.tilgængelighed}</p>
            </Sektion>

            <Sektion
              titel="Spillested & transport"
              tekst={event.spillested_transport}
            >
              {linjer(event.spillested_transport).map((l) => (
                <p key={l}>{l}</p>
              ))}
            </Sektion>

            <Sektion titel="Arrangør & vilkår" tekst={event.arrangør_vilkår}>
              <p>{event.arrangør_vilkår}</p>
            </Sektion>
          </div>

          <footer className={styles.bund}>
            <div>
              <p className={styles.prisLabel}>Billetter fra</p>
              <p className={styles.pris}>{pris} DKK</p>
            </div>
            {/* Lukker panelet og hopper ned til datolisten */}
            <a href="#datoer" className={styles.vaelg} onClick={luk}>
              Vælg billetter →
            </a>
          </footer>
        </div>
      </dialog>
    </>
  );
}
