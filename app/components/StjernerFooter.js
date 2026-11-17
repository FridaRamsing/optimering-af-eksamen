import styles from "./StjernerFooter.module.css";

// Laver tal mellem 0 og 1, der ser tilfældige ud,
// men er de samme hver gang (både på serveren og i browseren)
let froe = 1;

function tilfaeldigt() {
  froe = (froe * 16807) % 2147483647;
  return froe / 2147483647;
}

// Laver 350 stjerner med hver sin placering, størrelse og rytme.
// Fordelingen er som i Figma: de fleste ligger på linjen i bunden,
// nogle lige over den, og få svæver højt oppe.
const stjerner = [];

for (let i = 0; i < 350; i++) {
  const type = tilfaeldigt();
  const hoejde = tilfaeldigt();

  let bund;
  let drift;

  if (type < 0.6) {
    // 60 % – på linjen
    bund = hoejde * 2;
    drift = 2;
  } else if (type < 0.88) {
    // 28 % – lige over linjen
    bund = 2 + hoejde * 11;
    drift = 10;
  } else {
    // 12 % – svæver højt oppe
    bund = 13 + hoejde * 57;
    drift = 10;
  }

  stjerner.push({
    venstre: tilfaeldigt() * 100,
    bund: bund,
    stoerrelse: 1.5 + tilfaeldigt() * 1.2,
    varighed: 10 + tilfaeldigt() * 4,
    forsinkelse: tilfaeldigt() * -12,
    drift: drift,
  });
}

export default function StjernerFooter() {
  return (
    <div className={styles.stjerner} aria-hidden="true">
      {stjerner.map((s, i) => (
        <span
          key={i}
          className={styles.stjerne}
          style={{
            left: `${s.venstre}%`,
            bottom: `${s.bund}px`,
            width: `${s.stoerrelse}px`,
            height: `${s.stoerrelse}px`,
            animationDuration: `${s.varighed}s`,
            animationDelay: `${s.forsinkelse}s`,
            "--drift": `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
