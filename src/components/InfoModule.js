import React from "react";

const InfoModule = () => {
  return (
    <div className="alert alert-info mt-4">
      <h5 className="alert-heading">How to Use the Tablature Editor</h5>
      <p>
        The Tablature Editor allows you to create and customize guitar or bass
        tablatures. Follow the instructions below to get started:
      </p>
      <ul>
        <li>
          <strong>Write Notes:</strong> Enter notes in the format{" "}
          <code>string/fret</code>. For example, <code>6/0</code> means the 6th
          string played open.
        </li>
        <li>
          <strong>Create Measures:</strong> Use a vertical bar <code>|</code> to
          separate measures. Example: <code>6/0 5/2 | 4/2 3/0</code>.
        </li>
        <li>
          <strong>Add Chords:</strong> Group multiple strings for the same beat.
          Example: <code>6/3 5/2 4/2</code>.
        </li>
        <li>
          <strong>Select Instrument:</strong> Choose between guitar or bass to
          match your composition.
        </li>
      </ul>
      <p>
        Once you’re satisfied with your composition, click the{" "}
        <strong>Save</strong> button to save your tablature.
      </p>
    </div>
  );
};

export default InfoModule;
