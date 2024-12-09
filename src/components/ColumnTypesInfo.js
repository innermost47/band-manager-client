import React from "react";

const ColumnTypesInfo = () => {
  const typeDescriptions = [
    {
      type: "string",
      description: "Simple text without calculations",
    },
    {
      type: "int",
      description: "Integer numbers for calculations",
    },
    {
      type: "float",
      description: "Decimal numbers for precise calculations",
    },
    {
      type: "addition",
      description: "Automatic sum of numeric values in the row",
    },
    {
      type: "substraction",
      description: "Automatic subtraction of numeric values in the row",
    },
    {
      type: "multiplication",
      description: "Automatic multiplication of numeric values in the row",
    },
    {
      type: "division",
      description: "Automatic division of numeric values in the row",
    },
    {
      type: "boolean",
      description: "True/false values",
    },
  ];

  return (
    <div className="card shadow mb-3">
      <div className="card-header">
        <h5 className="card-title mb-0">Available Column Types</h5>
      </div>
      <div className="card-body">
        {typeDescriptions.map(({ type, description }) => (
          <div key={type} className="mb-3 rounded">
            <code className="bg-info text-white px-2 py-1 rounded me-2">
              {type}
            </code>
            {description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnTypesInfo;
