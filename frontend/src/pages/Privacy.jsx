import React from "react";
import { Container } from "react-bootstrap";

const Privacy = ({ theme }) => {
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
        <h1 className="mb-4 text-center">Privacy Policy</h1>
        <p>
          La tua privacy è importante per noi. In questa pagina spieghiamo come raccogliamo, usiamo e proteggiamo i tuoi dati personali durante l'utilizzo di GameVerse.
        </p>
        <h3>Raccolta dati</h3>
        <p>
          Raccogliamo solo i dati necessari per offrirti i nostri servizi, come nome, email e dati di navigazione.
        </p>
        <h3>Utilizzo dei dati</h3>
        <p>
          I dati raccolti vengono utilizzati esclusivamente per migliorare la tua esperienza e per comunicazioni importanti.
        </p>
        <h3>Protezione dei dati</h3>
        <p>
          Adottiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati da accessi non autorizzati.
        </p>
        <h3>Diritti dell'utente</h3>
        <p>
          Puoi richiedere in qualsiasi momento l'accesso, la modifica o la cancellazione dei tuoi dati personali.
        </p>
        <p className="fst-italic text-center mt-4">
          Per maggiori informazioni, contattaci alla pagina <a href="/contatti">Contatti</a>.
        </p>
      </div>
    </Container>
  );
};

export default Privacy;
