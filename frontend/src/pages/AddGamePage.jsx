import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AddGamePage = ({ theme }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    producer: "",
    category: [],
    releaseDate: "",
    platforms: [],
    genres: [],
    languagesInterface: [],
    languagesAudio: [],
    languagesSubtitles: [],
    gameplay: "",
    pegi: "",
    trailerLink: "",
    image: null,
  });

  const [options, setOptions] = useState({
    categories: [],
    genres: [],
    platforms: [],
    languages: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [catRes, genRes, platRes, langRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/genres"),
        fetch("/api/platforms"),
        fetch("/api/languages"),
      ]);

      if (!catRes.ok || !genRes.ok || !platRes.ok || !langRes.ok) {
        throw new Error("Errore nel caricamento delle opzioni");
      }

      const [categories, genres, platforms, languages] = await Promise.all([
        catRes.json(),
        genRes.json(),
        platRes.json(),
        langRes.json(),
      ]);

      setOptions({
        categories: categories.map((c) => ({ value: c._id, label: c.category || c.name })),
        genres: genres.map((g) => ({ value: g._id, label: g.genre || g.name })),
        platforms: platforms.map((p) => ({ value: p._id, label: p.platform || p.name })),
        languages: languages.map((l) => ({ value: l._id, label: l.language || l.name })),
      });
    } catch (err) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMultiSelectChange = (selected, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected ? selected.map((s) => s.value) : [],
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("uploadType", "games");

    const token = localStorage.getItem("token");

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Errore upload immagine");
    }

    const result = await res.json();
    return result.url;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Funzione helper per estrarre solo gli id dagli array di oggetti
  const extractIds = (arr) => Array.isArray(arr) ? arr.map(item => item.value || item) : [];

  setSubmitLoading(true);
  setSubmitError(null);
  setSuccessMessage(null);

  try {
    let imageUrl = null;
    if (formData.image) {
      imageUrl = await uploadImage(formData.image);
    }

    if (
      !formData.title ||
      !formData.producer ||
      !formData.category.length ||
      !formData.releaseDate ||
      !formData.platforms.length ||
      !formData.genres.length ||
      !formData.languagesInterface.length ||
      !formData.languagesAudio.length ||
      !formData.languagesSubtitles.length ||
      !formData.gameplay ||
      !formData.pegi ||
      !imageUrl
    ) {
      throw new Error("Compila tutti i campi obbligatori");
    }

    // Usa extractIds per estrarre solo gli id da ogni array
    const body = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      producer: formData.producer.trim(),
      releaseDate: formData.releaseDate,
      playMode: formData.gameplay,
      pegi: formData.pegi,
      trailerUrl: formData.trailerLink || "",
      category: extractIds(formData.category),
      platforms: extractIds(formData.platforms),
      genre: extractIds(formData.genres),
      languages: {
        interface: extractIds(formData.languagesInterface),
        audio: extractIds(formData.languagesAudio),
        subtitles: extractIds(formData.languagesSubtitles),
      },
      coverImage: imageUrl,
      rating: formData.rating || 3,
    };

    console.log("BODY DA INVIARE:", body); // << prova a vedere cosa manda

    const token = localStorage.getItem("token");

    const res = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Errore durante il salvataggio");
    }

    const savedGame = await res.json();
    const gameId = savedGame._id;

    navigate(`/giochi/${gameId}`);
  } catch (err) {
    setSubmitError(err.message);
  } finally {
    setSubmitLoading(false);
  }
};

  // Styles che imitano Form.Select di Bootstrap, con adattamento tema
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#fff" : "#212529",   // invertito rispetto al tema
    color: theme === "dark" ? "#000000" : "#f8f9fa",          // invertito rispetto al tema
    borderColor: state.isFocused
      ? theme === "dark"
        ? "#80bdff"
        : "#86b7fe"
      : theme === "dark"
      ? "#495057"
      : "#ced4da",
    boxShadow: state.isFocused
      ? theme === "dark"
        ? "0 0 0 0.2rem rgba(13,110,253,.5)"
        : "0 0 0 0.25rem rgba(13,110,253,.25)"
      : null,
    minHeight: 38,
    borderRadius: 4,
    cursor: "pointer",
    "&:hover": {
      borderColor: theme === "dark" ? "#80bdff" : "#86b7fe",
    },
    // Per cambiare il colore del testo digitato
    "& input": {
      color: theme === "dark" ? "#212529" : "#f8f9fa",
    },
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#fff" : "#212529",  // invertito
    color: theme === "dark" ? "#212529" : "#f8f9fa",          // invertito
    marginTop: 0,
    borderRadius: 4,
    boxShadow:
      theme === "dark"
        ? "0 0 10px rgba(0,0,0,0.1)"
        : "0 0 10px rgba(0,0,0,0.8)",
  }),
  menuList: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 200,
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? theme === "dark"
        ? "#e9ecef"
        : "#0d6efd"
      : state.isSelected
      ? theme === "dark"
        ? "#dee2e6"
        : "#0b5ed7"
      : theme === "dark"
      ? "#fff"
      : "#212529",
    color:
      state.isFocused || state.isSelected
        ? theme === "dark"
          ? "#212529"
          : "#fff"
        : theme === "dark"
        ? "#000000"
        : "#f8f9fa",
    cursor: "pointer",
    paddingTop: 6,
    paddingBottom: 6,
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#0d6efd" : "#e9ecef",
    borderRadius: 4,
    color: theme === "dark" ? "#fff" : "#212529",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#fff" : "#212529",
    fontSize: "0.875em",
    padding: "2px 6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#cfe2ff" : "#495057",
    ":hover": {
      backgroundColor: theme === "dark" ? "#0b5ed7" : "#adb5bd",
      color: theme === "dark" ? "white" : "black",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#000000" : "#000000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#212529" : "#f8f9fa",
  }),
};

  const bgColor = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";

  return (
    <Container fluid className={`${bgColor} py-4`} style={{ minHeight: "100vh" }}>
      <h1 className="mb-4 text-center">Aggiungi un nuovo gioco</h1>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Caricamento opzioni...</p>
        </div>
      )}

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {!loading && !error && (
        <Form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Immagine */}
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Immagine del gioco</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
          </Form.Group>

          {/* Titolo */}
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Titolo del gioco"
            />
          </Form.Group>

          {/* Descrizione */}
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Descrizione del gioco"
            />
          </Form.Group>

          {/* Produttore */}
          <Form.Group className="mb-3" controlId="producer">
            <Form.Label>Produttore</Form.Label>
            <Form.Control
              type="text"
              value={formData.producer}
              onChange={handleChange}
              required
              placeholder="Produttore del gioco"
            />
          </Form.Group>

               {/* Data di rilascio */}
          <Form.Group className="mb-3" controlId="releaseDate">
            <Form.Label>Data di rilascio</Form.Label>
            <Form.Control type="date" value={formData.releaseDate} onChange={handleChange} required />
          </Form.Group>

          {/* Categorie - multiselect stile dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Select
              isMulti
              options={options.categories}
              onChange={(selected) => handleMultiSelectChange(selected, "category")}
              placeholder="Seleziona categorie"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef", // hover option
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>

          {/* Piattaforme */}
          <Form.Group className="mb-3">
            <Form.Label>Piattaforme</Form.Label>
            <Select
              isMulti
              options={options.platforms}
              onChange={(selected) => handleMultiSelectChange(selected, "platforms")}
              placeholder="Seleziona piattaforme"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef",
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>

          {/* Generi */}
          <Form.Group className="mb-3">
            <Form.Label>Generi</Form.Label>
            <Select
              isMulti
              options={options.genres}
              onChange={(selected) => handleMultiSelectChange(selected, "genres")}
              placeholder="Seleziona generi"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef",
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>

         {/* Lingua Interfaccia */}
          <Form.Group className="mb-3">
            <Form.Label>Lingua Interfaccia</Form.Label>
            <Select
              isMulti
              options={options.languages}
              onChange={(selected) => handleMultiSelectChange(selected, "languagesInterface")}
              placeholder="Seleziona lingue interfaccia"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef",
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>

          {/* Lingua Audio */}
          <Form.Group className="mb-3">
            <Form.Label>Lingua Audio</Form.Label>
            <Select
              isMulti
              options={options.languages}
              onChange={(selected) => handleMultiSelectChange(selected, "languagesAudio")}
              placeholder="Seleziona lingue audio"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef",
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>

          {/* Lingua Sottotitoli */}
          <Form.Group className="mb-3">
            <Form.Label>Lingua Sottotitoli</Form.Label>
            <Select
              isMulti
              options={options.languages}
              onChange={(selected) => handleMultiSelectChange(selected, "languagesSubtitles")}
              placeholder="Seleziona lingue sottotitoli"
              styles={customSelectStyles}
              classNamePrefix="react-select"
              theme={(base) => ({
                ...base,
                colors: {
                  ...base.colors,
                  primary25: theme === "dark" ? "#0d6efd33" : "#e9ecef",
                  primary: theme === "dark" ? "#0d6efd" : "#0d6efd",
                },
              })}
            />
          </Form.Group>
          {/* Giocabilità */}
        <Form.Group controlId="gameplay" className="mb-3">
            <Form.Label>Giocabilità</Form.Label>
            <div className="d-flex flex-column mt-2" role="group" aria-label="Seleziona giocabilità">
              {["singleplayer", "multiplayer", "singleplayer-multiplayer"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`btn btn-outline-primary mb-2 ${
                    formData.gameplay === mode ? "active" : ""
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, gameplay: mode }))}
                >
                  {mode}
                </button>
              ))}
            </div>
          </Form.Group>

          {/* PEGI */}
          <Form.Group className="mb-3" controlId="pegi">
            <Form.Label>PEGI</Form.Label>
            <Form.Select value={formData.pegi} onChange={handleChange} required>
              <option value="">Seleziona</option>
              <option value="3">3</option>
              <option value="7">7</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="18">18</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Valutazione</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color: star <= formData.rating ? "#ffc107" : "#e4e5e9",
                    fontSize: "1.5rem",
                    marginRight: 4,
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setFormData(prev => ({ ...prev, rating: star }));
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${star} stelle`}
                >
                  ★
                </span>
              ))}
            </div>
          </Form.Group>


          {/* Trailer */}
          <Form.Group className="mb-3" controlId="trailerLink">
            <Form.Label>Trailer YouTube</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.trailerLink}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant={theme === "dark" ? "light" : "primary"} type="submit" className="w-100">
            Aggiungi gioco
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddGamePage;
