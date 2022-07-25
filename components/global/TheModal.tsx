import React, { useState } from "react";

type Props = {
  button: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  title: string;
  content: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

const TheModal = ({ button, title, content }: Props) => {
  const [show, setShow] = useState<boolean>(false);

  const showModal = () => {
    setShow(!show);
  };

  return (
    <>
      {React.cloneElement(button, { showModal: showModal })}
      {show && (
        <div
          className={`modal ${
            (title === "Ingresar" && "modal-centered") ||
            (title === "Registrarse" && "modal-centered")
          }`}
          id="modal"
        >
          <h2>
            {title}
            <button className="float-right" onClick={showModal}>
              X
            </button>
          </h2>
          <div className="content">
            {React.cloneElement(content, { showModal: showModal })}
          </div>
        </div>
      )}
    </>
  );
};

export default TheModal;
