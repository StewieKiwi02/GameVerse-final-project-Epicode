import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const Contatti = ({ theme }) => {
  const bgColor = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  const inputBg = theme === "dark" ? "#333" : "#fff";
  const inputColor = theme === "dark" ? "#eee" : "#000";
  const placeholderColor = theme === "dark" ? "#aaa" : "#666";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Messaggio inviato!\n\nNome: ${formData.name}\nEmail: ${formData.email}\nMessaggio: ${formData.message}`
    );
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Container
      fluid
      className={`${bgColor} d-flex flex-column justify-content-center align-items-center`}
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div className="p-4 rounded" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="mb-4 text-center">Contattaci</h1>
        <p className="text-center mb-4 fst-italic">
          Hai domande o suggerimenti? Scrivici, saremo felici di aiutarti!
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il tuo nome"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                backgroundColor: inputBg,
                color: inputColor,
                caretColor: inputColor,
              }}
              className="custom-placeholder"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci la tua email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                backgroundColor: inputBg,
                color: inputColor,
                caretColor: inputColor,
              }}
              className="custom-placeholder"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="message">
            <Form.Label>Messaggio</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Scrivi qui il tuo messaggio"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                backgroundColor: inputBg,
                color: inputColor,
                caretColor: inputColor,
              }}
              className="custom-placeholder"
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant={theme === "dark" ? "light" : "dark"} type="submit">
              Invia
            </Button>
          </div>
        </Form>
      </div>

      <style>
        {`
          .custom-placeholder::placeholder {
            color: ${placeholderColor} !important;
            opacity: 1 !important;
          }
        `}
      </style>
    </Container>
  );
};

export default Contatti;
