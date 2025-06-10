import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsInstagram,
  BsTwitter,
  BsFacebook,
  BsYoutube,
  BsMedium,
  BsGithub,
} from "react-icons/bs";

const Footer = ({ theme }) => {
  const bgColor = theme === "dark" ? "bg-dark" : "bg-light";
  const textColor = theme === "dark" ? "#eee" : "#333";

  const iconStyle = {
    color: textColor,
    fontSize: "1.4rem",
    cursor: "pointer",
    transition: "color 0.3s ease",
  };

  const iconHoverStyle = {
    color: theme === "dark" ? "#1DA1F2" : "#0d6efd",
  };

  const separatorStyle = {
    borderBottom: `1px solid ${theme === "dark" ? "#444" : "#ccc"}`,
    paddingBottom: "0.75rem",
    marginBottom: "1rem",
  };

  return (
    <footer
      className={bgColor}
      style={{
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        marginTop: "auto",
      }}
    >
      <Container>
        {/* Copyright */}
        <Row className="mb-3" style={{ color: textColor, ...separatorStyle }}>
          <Col className="text-center">
            <small>© 2025 GameVerse</small>
          </Col>
        </Row>

        {/* Link e icone */}
        <Row className="mb-3 align-items-center" style={separatorStyle}>
          {/* Link pagine */}
          <Col xs={12} md={6} className="mb-2 mb-md-0 text-center text-md-start">
            <Nav className="justify-content-center justify-content-md-start">
              {["contatti", "privacy", "termini"].map((page) => (
                <Nav.Item key={page}>
                  <Nav.Link
                    as={Link}
                    to={`/${page}`}
                    style={{ color: textColor, marginRight: "15px" }}
                    className="py-0"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          {/* Icone social */}
          <Col xs={12} md={6} className="text-center text-md-end">
            {[
              {
                Icon: BsInstagram,
                href: "https://instagram.com/gameverse_official000",
                label: "Instagram",
              },
              {
                Icon: BsTwitter,
                href: "https://twitter.com/gameverse_official000",
                label: "X (Twitter)",
              },
              {
                Icon: BsFacebook,
                href: "https://facebook.com/gameverse.official000",
                label: "Facebook",
              },
              {
                Icon: BsYoutube,
                href: "https://youtube.com/gameversechannel000",
                label: "YouTube",
              },
              {
                Icon: BsMedium,
                href: "https://medium.com/@gameverse000",
                label: "Medium",
              },
              {
                Icon: BsGithub,
                href: "https://github.com/gameverse000",
                label: "GitHub",
              },
            ].map(({ Icon, href, label }, i, arr) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  ...iconStyle,
                  marginRight: i === arr.length - 1 ? 0 : "15px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = iconHoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textColor;
                }}
              >
                <Icon />
              </a>
            ))}
          </Col>
        </Row>

        {/* Motto */}
        <Row>
          <Col className="text-center fst-italic" style={{ color: textColor }}>
            <small>
              "GameVerse: dove il gioco incontra la passione e l'innovazione."
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
