import React from "react";

const PsychologistsDetail = ({ psychologist }) => {
  return (
    <div>
      Psychologist ID: {psychologist.id}
      <br />
      Psychologist name: {psychologist.name}
      <br />
      Additional data: {psychologist.additional_data}
    </div>
  );
};

export default PsychologistsDetail;
