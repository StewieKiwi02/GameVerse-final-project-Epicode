import React from "react";
import { Container } from "react-bootstrap";

const Termini = ({ theme }) => {
  const bgColor = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";

  return (
    <Container
      fluid
      className={`${bgColor} d-flex flex-column justify-content-center align-items-center`}
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div
        className="p-4 rounded"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <h1 className="mb-4 text-center">Termini e Condizioni</h1>
        <p>
          Benvenuto su GameVerse. Usando il nostro sito accetti i seguenti termini e condizioni:
        </p>
        <h3>Uso del sito</h3>
        <p>
          Puoi utilizzare GameVerse solo per scopi leciti e nel rispetto delle leggi vigenti.
        </p>
        <h3>Proprietà intellettuale</h3>
        <p>
          Tutti i contenuti sono protetti da copyright e non possono essere copiati o utilizzati senza autorizzazione.
        </p>
        <h3>Limitazione di responsabilità</h3>
        <p>
          Non siamo responsabili per eventuali danni derivanti dall'uso del sito o dei contenuti.
        </p>
        <h3>Modifiche ai termini</h3>
        <p>
          Ci riserviamo il diritto di modificare questi termini in qualsiasi momento, pubblicando le versioni aggiornate sul sito.
        </p>
        <p className="fst-italic text-center mt-4">
          Per dubbi o richieste, visita la pagina <a href="/contatti">Contatti</a>.
        </p>
      </div>
    </Container>
  );
};

export default Termini;
