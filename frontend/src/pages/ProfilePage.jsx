import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image, Alert } from "react-bootstrap";
import axios from "axios";
import {
  BsPencilSquare,
  BsSave,
  BsX,
  BsBoxArrowRight,
  BsTrash,
  BsShieldLock,
  BsInstagram,
  BsTwitter,
  BsFacebook,
  BsYoutube,
  BsMedium,
  BsGithub,
  BsCamera,
  BsEye, 
  BsEyeSlash
} from "react-icons/bs";



const socialIcons = {
  facebook: BsFacebook,
  twitter: BsTwitter,
  instagram: BsInstagram,
  youtube: BsYoutube,
  medium: BsMedium,
  github: BsGithub,
};

// Componente per upload immagine semplice
const ImageUpload = ({ onChange, disabled }) => (
  <Form.Control
    type="file"
    accept="image/*"
    onChange={(e) => onChange(e.target.files[0])}
    disabled={disabled}
  />
);

const ProfilePage = ({ theme = "light" }) => {
  const [profile, setProfile] = useState({
    banner: "",
    profilePic: "",
    name: "",
    surname: "",
    username: "",
    bio: "",
    phone: "",
    email: "",
    birthday: "",
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
      medium: "",
      github: "",
    },
    password: "",
    repeatPassword: "",
    isAdmin: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Prendo la password admin dal file .env (VITE_ADMIN_PASSWORD)
  const adminPasswordFromEnv = import.meta.env.VITE_ADMIN_PASSWORD || "";

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    return () => {
      document.body.classList.remove("theme-light", "theme-dark");
    };
  }, [theme]);

  const fetchProfile = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mergedData = {
      banner: data.banner || "",
      profilePic: data.profilePic || "",
      name: data.name || "",
      surname: data.surname || "",
      username: data.username || "",
      bio: data.bio || "",
      phone: data.phone || "",
      email: data.email || "",
      birthday: data.birthday || "",
      social: {
        facebook: data.social?.facebook || "",
        twitter: data.social?.twitter || "",
        instagram: data.social?.instagram || "",
        youtube: data.social?.youtube || "",
        medium: data.social?.medium || "",
        github: data.social?.github || "",
      },
      password: "",
      repeatPassword: "",
      isAdmin: data.isAdmin || false,
    };

    setProfile(mergedData);
    setOriginalProfile(mergedData);
    setErrorMsg("");
  } catch (error) {
    setErrorMsg("Errore nel caricamento del profilo.");
  }
};



  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        social: { ...prev.social, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (key, file) => {
    setProfile((prev) => ({ ...prev, [key]: file }));
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset"
    );
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "default_cloud_name";

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleSave = async () => {
    if (profile.password !== profile.repeatPassword) {
      setErrorMsg("Le password non coincidono.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      let profilePicUrl = profile.profilePic;
      let bannerUrl = profile.banner;

      if (profile.profilePic instanceof File) {
        profilePicUrl = await uploadImage(profile.profilePic);
      }
      if (profile.banner instanceof File) {
        bannerUrl = await uploadImage(profile.banner);
      }

      const updatedProfile = {
        ...profile,
        profilePic: profilePicUrl,
        banner: bannerUrl,
      };

      // Password non inviata qui, gestita a parte
      delete updatedProfile.password;
      delete updatedProfile.repeatPassword;

      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profile.password) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/update-password`,
          { currentPassword: "", newPassword: profile.password },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      await fetchProfile();
      setEditMode(false);
    } catch (err) {
      setErrorMsg("Errore durante il salvataggio. Controlla i dati e riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfile({ ...originalProfile, password: "", repeatPassword: "" });
    }
    setEditMode(false);
    setErrorMsg("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare il profilo? Questa azione è irreversibile.")) return;
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleLogout();
    } catch (error) {
      setErrorMsg("Errore durante l'eliminazione dell'account.");
    } finally {
      setLoading(false);
    }
  };

const handleBecomeAdmin = async () => {
  setAdminError("");
  if (!adminPw) {
    setAdminError("Inserisci la password admin.");
    return;
  }
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/become-admin`,
      { adminPw: adminPw }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.success) {
      setProfile((prev) => ({ ...prev, isAdmin: true }));
      setAdminPw("");
      setShowAdminInput(false);
    } else {
      setAdminError(data.message || "Errore nell'upgrade admin.");
    }
  } catch (error) {
    setAdminError(error.response?.data?.message || "Errore nell'upgrade admin.");
  }
};


  const handleLeaveAdmin = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/leave-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProfile((prev) => ({ ...prev, isAdmin: false }));
      }
    } catch {
      setAdminError("Errore nell'abbandonare il ruolo admin.");
    }
  };

  const borderClass = "border border-3 border-primary";

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="flex-grow-1 d-flex flex-column justify-content-center">
        <h2 className="text-center mb-4">Il mio profilo</h2>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* Banner rettangolare */}
        <div className="w-100 position-relative mb-3" style={{ minHeight: 180 }}>
          <div
            className={`w-100 mx-auto ${borderClass}`}
            style={{
              height: 180,
              borderRadius: 16,
              background:
                profile.banner && typeof profile.banner === "string"
                  ? `url(${profile.banner}) center/cover no-repeat`
                  : `url("/assets/profileBanner/Nothing banner.jpg") center/cover no-repeat`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {!profile.banner && (
              <span className="fw-bold" style={{ opacity: 0.3 }}>
                Nessun banner caricato
              </span>
            )}
          </div>
          {/* Foto profilo cerchio con bordo, sovrapposta al banner */}
          <div
            className={`position-absolute ${borderClass} bg-white`}
            style={{
              left: 32,
              bottom: -64,
              zIndex: 2,
              width: 128,
              height: 128,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 6px rgba(0,0,0,0.07)",
            }}
          >
           <Image
            src={
              profile.profilePic && typeof profile.profilePic === 'string'
                ? profile.profilePic
                : '/assets/profile/Nothing Profile.jpg'
            }
            alt="Profilo"
            roundedCircle
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          </div>
        </div>

        {/* Pulsanti cambia banner e foto profilo */}
        <div className="d-flex justify-content-between align-items-start flex-wrap mb-4" style={{ marginTop: "5rem", gap: "1rem" }}>
          <div className="text-center" style={{ marginLeft: "20px" }}>
            <p className="mb-2 fw-semibold">Foto profilo</p>
            <ImageUpload
              onChange={(file) => handleImageChange("profilePic", file)}
              disabled={!editMode}
            />
          </div>
          <div className="text-center" style={{ marginRight: "20px", marginTop: "-80PX" }}>
            <p className="mb-2 fw-semibold">Banner profilo</p>
            <ImageUpload
              onChange={(file) => handleImageChange("banner", file)}
              disabled={!editMode}
            />
          </div>
        </div>

        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="surname">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={profile.surname}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="phone">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="birthday">
                <Form.Label>Data di nascita</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={profile.birthday}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="bio" className="mb-3">
            <Form.Label>Biografia</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!editMode}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Lascia vuoto per mantenere"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="repeatPassword">
                <Form.Label>Ripeti Password</Form.Label>
                <Form.Control
                  type="password"
                  name="repeatPassword"
                  value={profile.repeatPassword}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Lascia vuoto per mantenere"
                />
              </Form.Group>
            </Col>
          </Row>

          <h5>Social</h5>
          <Row className="mb-3">
            {Object.entries(profile.social).map(([key, value]) => {
              const Icon = socialIcons[key];
              return (
                <Col md={4} key={key} className="mb-2">
                  <Form.Group controlId={`social.${key}`}>
                    <Form.Label>
                      <Icon className="me-2" />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={`social.${key}`}
                      value={value}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </Form.Group>
                </Col>
              );
            })}
          </Row>

          <Row className="mt-5 align-items-center">
            <Col xs={12} md={4} className="d-flex justify-content-start mb-3">
              <Button
                variant="danger"
                onClick={handleLogout}
                className="w-100 py-2"
              >
                <BsBoxArrowRight className="me-2" />
                Logout
              </Button>
            </Col>
            <Col xs={12} md={4} className="d-flex flex-column align-items-center mb-3">
              {profile.isAdmin ? (
                <>
                  <div className="w-100 mb-2 text-center py-2 bg-success text-white rounded">
                    <BsShieldLock className="me-2" />
                    SEI ADMIN
                  </div>
                  {editMode && (
                    <Button
                      variant="outline-warning"
                      onClick={handleLeaveAdmin}
                      className="w-100 py-2"
                    >
                      <BsShieldLock className="me-2" />
                      Lascia Admin
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {!showAdminInput ? (
                    <Button
                      variant="warning"
                      className="w-100 py-2 mb-2"
                      onClick={() => setShowAdminInput(true)}
                    >
                      <BsShieldLock className="me-2" />
                      Diventa Admin
                    </Button>
                  ) : (
                    <div
                    className="d-flex w-100 gap-2 mb-2"
                    style={{ maxWidth: "400px" }}
                  >
                    <div className="position-relative" style={{ width: "60%" }}>
                      <Form.Control
                        type={showAdminPassword ? "text" : "password"}
                        placeholder="Password admin"
                        value={adminPw}
                        onChange={(e) => setAdminPw(e.target.value)}
                        size="sm"
                      />
                      <span
                        onClick={() => setShowAdminPassword(prev => !prev)}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          opacity: 0.6,
                        }}
                      >
                        {showAdminPassword ? <BsEyeSlash /> : <BsEye />}
                      </span>
                    </div>
                    <Button
                      variant="success"
                      onClick={handleBecomeAdmin}
                      size="sm"
                    >
                      <BsShieldLock className="me-2" />
                      Conferma
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowAdminInput(false)}
                      size="sm"
                    >
                      <BsX />
                    </Button>
                  </div>
                  )}
                  {adminError && (
                    <div className="text-danger mt-2">{adminError}</div>
                  )}
                </>
              )}
              <Button
                variant="outline-danger"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-100 py-2 mt-3"
              >
                <BsTrash className="me-2" />
                Elimina Profilo
              </Button>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-end mb-3">
              {!editMode ? (
                <Button
                  variant="primary"
                  onClick={() => setEditMode(true)}
                  className="w-100 py-2"
                >
                  <BsPencilSquare className="me-2" />
                  Modifica Profilo
                </Button>
              ) : (
                <div className="d-flex w-100 gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="w-50 py-2"
                  >
                    <BsX className="me-2" />
                    Annulla
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={loading}
                    className="w-50 py-2"
                  >
                    <BsSave className="me-2" />
                    {loading ? "Salvataggio..." : "Salva"}
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default ProfilePage;
