import React from 'react';
import { Container } from 'react-bootstrap';
import './TitleBanner.css';

const TitleBanner = ({ username }) => {
  const cleanName = typeof username === 'string' && username.trim().length > 0 ? username.trim() : null;

  return (
    <div className="title-banner">
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100%' }}
      >
        <h1 className="rainbow-text m-0 text-center">
          {cleanName ? `Bentornato su GameVerse, ${cleanName}!` : 'Benvenuto su GameVerse'}
        </h1>
      </Container>
    </div>
  );
};

export default TitleBanner;
