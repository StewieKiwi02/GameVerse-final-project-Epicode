import React, { useRef } from "react";
import { Button, Image } from "react-bootstrap";

const ImageUpload = ({ label, image, onImageChange }) => {
  const fileInputRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="mb-3 text-center">
      {image && (
        <Image
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          fluid
          rounded
          style={{ maxHeight: label === "Banner" ? "200px" : "150px", objectFit: "cover" }}
        />
      )}
      <div className="mt-2">
        <Button
          variant="outline-primary"
          onClick={() => fileInputRef.current.click()}
          size="sm"
        >
          Cambia {label}
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
