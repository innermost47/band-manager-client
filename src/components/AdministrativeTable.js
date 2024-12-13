import React, { useState, useEffect, useCallback } from "react";
import { confirmAlert } from "react-confirm-alert";
import { COLUMN_TYPES } from "../config/constants";

const AdministrativeTable = ({ task, onUpdate, onDelete }) => {
  const [tableStructure, setTableStructure] = useState(() => {
    const defaultStructure = {
      columns: [],
      columnTypes: [],
      columnsToTotal: {},
    };

    if (!task.tableStructure) {
      return defaultStructure;
    }

    if (
      task.tableStructure.columns &&
      Array.isArray(task.tableStructure.columns)
    ) {
      const columns = task.tableStructure.columns;
      const columnTypes = Array.isArray(task.tableStructure.columnTypes)
        ? task.tableStructure.columnTypes
        : columns.map(() => "string");

      while (columnTypes.length < columns.length) {
        columnTypes.push("string");
      }

      return {
        ...task.tableStructure,
        columns,
        columnTypes,
        columnsToTotal: task.tableStructure.columnsToTotal || {},
      };
    }

    return defaultStructure;
  });
  const [columnTypes, setColumnTypes] = useState(() => {
    return (
      tableStructure.columnTypes || tableStructure.columns.map(() => "string")
    );
  });

  const [tableValues, setTableValues] = useState(
    task.tableValues?.length > 0 ? task.tableValues : [{}]
  );
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");
  const [isEditing, setIsEditing] = useState(false);
  const [rowType, setRowType] = useState("entry");
  const [columnsToTotal, setColumnsToTotal] = useState(
    task.tableStructure?.columnsToTotal || {}
  );
  const [initialTableStructure, setInitialTableStructure] = useState(null);
  const [initialColumnTypes, setInitialColumnTypes] = useState(null);
  const [initialTableValues, setInitialTableValues] = useState(null);
  const [initialColumnsToTotal, setInitialColumnsToTotal] = useState(null);

  useEffect(() => {
    if (tableValues.length === 0) {
      setTableValues([{}]);
    }
  }, [tableValues.length]);

  const findPreviousTotalColumn = useCallback(
    (currentIndex) => {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (columnTypes[i] === "total") {
          return i;
        }
      }
      return -1;
    },
    [columnTypes]
  );

  const calculateRowTotal = useCallback(
    (row, columnIndex) => {
      const previousTotalIndex = findPreviousTotalColumn(columnIndex);
      const startIndex = previousTotalIndex + 1;

      return tableStructure.columns
        .slice(startIndex, columnIndex)
        .reduce((sum, col, idx) => {
          const actualIdx = startIndex + idx;
          if (
            ["int", "float"].includes(columnTypes[actualIdx]) &&
            columnsToTotal[col]
          ) {
            const value = parseFloat(row[col]) || 0;
            return sum + value;
          }
          return sum;
        }, 0);
    },
    [
      tableStructure.columns,
      columnTypes,
      columnsToTotal,
      findPreviousTotalColumn,
    ]
  );

  const calculateTotals = useCallback(() => {
    const previousValues = JSON.stringify(tableValues);
    const updatedValues = tableValues.map((row) => {
      if (row[tableStructure.columns[0]] === "TOTAL") {
        return row;
      }
      const updatedRow = { ...row };
      tableStructure.columns.forEach((col, index) => {
        const operation = columnTypes[index].toLowerCase();

        if (operation === "total") {
          updatedRow[col] = calculateRowTotal(row, index);
        } else if (
          ["addition", "substraction", "multiplication", "division"].includes(
            operation
          )
        ) {
          let result = operation === "multiplication" ? 1 : 0;
          let isFirstValue = true;

          tableStructure.columns.forEach((calcCol, calcIndex) => {
            if (
              calcIndex < index &&
              ["int", "float"].includes(columnTypes[calcIndex])
            ) {
              const value = parseFloat(row[calcCol]) || 0;
              if (isFirstValue) {
                result = value;
                isFirstValue = false;
              } else {
                switch (operation) {
                  case "addition":
                    result += value;
                    break;
                  case "substraction":
                    result -= value;
                    break;
                  case "multiplication":
                    result *= value;
                    break;
                  case "division":
                    if (value !== 0) {
                      result /= value;
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          });
          updatedRow[col] = result;
        }
      });
      return updatedRow;
    });

    if (JSON.stringify(updatedValues) !== previousValues) {
      setTableValues(updatedValues);
    }
  }, [columnTypes, tableValues, tableStructure.columns, calculateRowTotal]);

  useEffect(() => {
    if (isEditing) {
      calculateTotals();
    }
  }, [calculateTotals, isEditing]);

  const handleAddRow = () => {
    const newRow = tableStructure.columns.reduce((acc, col, index) => {
      if (columnTypes[index] === "boolean") {
        acc[col] = false;
      } else if (columnTypes[index] === "total") {
        acc[col] = calculateRowTotal({}, index);
      } else {
        acc[col] = "";
      }
      return acc;
    }, {});

    if (rowType === "total") {
      tableStructure.columns.forEach((col, index) => {
        if (
          ["int", "float"].includes(columnTypes[index]) &&
          columnsToTotal[col]
        ) {
          const total = tableValues.reduce((sum, row) => {
            const value = parseFloat(row[col]) || 0;
            return sum + value;
          }, 0);
          newRow[col] = total;
        }
      });
      newRow[tableStructure.columns[0]] = "TOTAL";
    }
    setTableValues([...tableValues, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    confirmAlert({
      title: "Delete Row",
      message:
        "Are you sure you want to delete this row? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            const updatedValues = tableValues.filter(
              (_, index) => index !== rowIndex
            );
            setTableValues(updatedValues);
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      setInitialTableStructure(JSON.parse(JSON.stringify(tableStructure)));
      setInitialColumnTypes([...columnTypes]);
      setInitialTableValues(JSON.parse(JSON.stringify(tableValues)));
      setInitialColumnsToTotal({ ...columnsToTotal });
    } else {
      setTableStructure(initialTableStructure);
      setColumnTypes(initialColumnTypes);
      setTableValues(initialTableValues);
      setColumnsToTotal(initialColumnsToTotal);
    }
    setIsEditing(!isEditing);
  };

  const handleAddColumn = () => {
    if (
      !newColumnName.trim() ||
      tableStructure.columns.includes(newColumnName)
    ) {
      return;
    }

    const trimmedName = newColumnName.trim();
    const currentColumns = Array.isArray(tableStructure.columns)
      ? tableStructure.columns
      : [];
    const currentTypes = Array.isArray(columnTypes) ? columnTypes : [];

    const updatedColumns = [...currentColumns, trimmedName];
    const updatedTypes = [...currentTypes, newColumnType];
    setTableStructure((prev) => ({
      ...prev,
      columns: updatedColumns,
      columnTypes: updatedTypes,
    }));

    setColumnTypes(updatedTypes);
    setTableValues((prevValues) => {
      const updatedValues = Array.isArray(prevValues) ? prevValues : [];
      return updatedValues.map((row) => ({
        ...row,
        [trimmedName]: newColumnType === "boolean" ? false : "",
      }));
    });
    if (
      [
        "int",
        "float",
        "addition",
        "substraction",
        "multiplication",
        "division",
      ].includes(newColumnType)
    ) {
      setColumnsToTotal((prev) => ({
        ...prev,
        [trimmedName]: true,
      }));
    }

    setNewColumnName("");
    setNewColumnType("string");
  };

  useEffect(() => {
    if (tableStructure.columns && tableStructure.columns.length > 0) {
      if (task.tableStructure?.columnsToTotal) {
        setColumnsToTotal(task.tableStructure.columnsToTotal);
      } else {
        const initialColumnsToTotal = {};
        tableStructure.columns.forEach((col, index) => {
          if (
            [
              "int",
              "float",
              "addition",
              "substraction",
              "multiplication",
              "division",
            ].includes(columnTypes[index])
          ) {
            initialColumnsToTotal[col] = true;
          }
        });
        setColumnsToTotal(initialColumnsToTotal);
      }
    }
  }, [
    tableStructure.columns,
    columnTypes,
    task.tableStructure?.columnsToTotal,
  ]);

  const handleDeleteColumn = (columnName) => {
    confirmAlert({
      title: "Delete Column",
      message:
        "Are you sure you want to delete this column? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => {
            const columnIndex = tableStructure.columns.indexOf(columnName);
            const updatedColumns = tableStructure.columns.filter(
              (col) => col !== columnName
            );
            const updatedTypes = columnTypes.filter(
              (_, index) => index !== columnIndex
            );
            const updatedValues = tableValues.map((row) => {
              const updatedRow = { ...row };
              delete updatedRow[columnName];
              return updatedRow;
            });
            setTableStructure({
              ...tableStructure,
              columns: updatedColumns,
              columnTypes: updatedTypes,
            });
            setColumnTypes(updatedTypes);
            setTableValues(updatedValues);
            const updatedColumnsToTotal = { ...columnsToTotal };
            delete updatedColumnsToTotal[columnName];
            setColumnsToTotal(updatedColumnsToTotal);
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    const columnIndex = tableStructure.columns.indexOf(columnName);
    const updatedValues = [...tableValues];
    if (columnTypes[columnIndex].toLowerCase() === "boolean") {
      updatedValues[rowIndex][columnName] = value === "true";
    } else {
      updatedValues[rowIndex][columnName] = value;
    }
    updatedValues.forEach((row, index) => {
      if (index !== rowIndex) return;
      tableStructure.columns.forEach((col, colIndex) => {
        const operation = columnTypes[colIndex].toLowerCase();
        if (
          ["addition", "substraction", "multiplication", "division"].includes(
            operation
          )
        ) {
          let result = operation === "multiplication" ? 1 : 0;
          let isFirstValue = true;

          for (let i = 0; i < colIndex; i++) {
            if (["int", "float"].includes(columnTypes[i])) {
              const value = parseFloat(row[tableStructure.columns[i]]) || 0;
              if (isFirstValue) {
                result = value;
                isFirstValue = false;
              } else {
                switch (operation) {
                  case "addition":
                    result += value;
                    break;
                  case "substraction":
                    result -= value;
                    break;
                  case "multiplication":
                    result *= value;
                    break;
                  case "division":
                    if (value !== 0) result /= value;
                    break;
                  default:
                    result += value;
                    break;
                }
              }
            }
          }
          row[col] = result;
        }
      });
    });

    const totalRowIndex = updatedValues.findIndex(
      (row) => row[tableStructure.columns[0]] === "TOTAL"
    );

    if (totalRowIndex !== -1) {
      tableStructure.columns.forEach((col, colIndex) => {
        if (columnsToTotal[col]) {
          const columnTotal = updatedValues
            .slice(0, totalRowIndex)
            .reduce((sum, row) => sum + (parseFloat(row[col]) || 0), 0);
          updatedValues[totalRowIndex][col] = columnTotal;
        }
      });
    }

    setTableValues(updatedValues);
  };
  const handleChangeColumnType = (columnIndex, newType) => {
    const updatedTypes = [...columnTypes];
    updatedTypes[columnIndex] = newType;
    setColumnTypes(updatedTypes);
    const columnName = tableStructure.columns[columnIndex];
    if (
      [
        "int",
        "float",
        "addition",
        "substraction",
        "multiplication",
        "division",
      ].includes(newType)
    ) {
      setColumnsToTotal((prev) => ({
        ...prev,
        [columnName]: true,
      }));
    } else {
      setColumnsToTotal((prev) => {
        const updated = { ...prev };
        delete updated[columnName];
        return updated;
      });
    }

    calculateTotals();
  };

  const handleMoveColumn = (columnName, direction) => {
    const columnIndex = tableStructure.columns.indexOf(columnName);
    if (
      (direction === "left" && columnIndex > 0) ||
      (direction === "right" && columnIndex < tableStructure.columns.length - 1)
    ) {
      const targetIndex =
        direction === "left" ? columnIndex - 1 : columnIndex + 1;
      const updatedColumns = [...tableStructure.columns];
      [updatedColumns[columnIndex], updatedColumns[targetIndex]] = [
        updatedColumns[targetIndex],
        updatedColumns[columnIndex],
      ];

      const updatedValues = tableValues.map((row) => {
        const reorderedRow = {};
        updatedColumns.forEach((col) => {
          reorderedRow[col] = row[col];
        });
        return reorderedRow;
      });

      const updatedColumnTypes = [...columnTypes];
      [updatedColumnTypes[columnIndex], updatedColumnTypes[targetIndex]] = [
        updatedColumnTypes[targetIndex],
        updatedColumnTypes[columnIndex],
      ];

      setTableStructure({
        ...tableStructure,
        columns: updatedColumns,
        columnTypes: updatedColumnTypes,
      });
      setTableValues(updatedValues);
      setColumnTypes(updatedColumnTypes);
      calculateTotals();
    }
  };

  const toggleColumnTotal = (columnName) => {
    setColumnsToTotal((prev) => {
      const newColumnsToTotal = {
        ...prev,
        [columnName]: !prev[columnName],
      };
      setTableValues((currentValues) => {
        const updatedValues = [...currentValues];
        const totalRowIndex = updatedValues.findIndex(
          (row) => row[tableStructure.columns[0]] === "TOTAL"
        );
        if (totalRowIndex !== -1) {
          if (newColumnsToTotal[columnName]) {
            const columnTotal = updatedValues
              .slice(0, totalRowIndex)
              .reduce((sum, row) => {
                const value = parseFloat(row[columnName]) || 0;
                return sum + value;
              }, 0);

            updatedValues[totalRowIndex][columnName] = columnTotal;
          } else {
            updatedValues[totalRowIndex][columnName] = "";
          }
        }
        return updatedValues;
      });
      return newColumnsToTotal;
    });
  };

  const handleSave = () => {
    const updatedTask = {
      ...task,
      tableStructure: {
        ...tableStructure,
        columnTypes,
        columnsToTotal,
      },
      tableValues,
    };
    setInitialTableStructure(null);
    setInitialColumnTypes(null);
    setInitialTableValues(null);
    setInitialColumnsToTotal(null);
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const renderColumnType = (index) => {
    console.log(columnTypes);
    if (!columnTypes || index >= columnTypes.length) {
      return "string";
    }
    return columnTypes[index];
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-body overflowScroll">
        <div className="mb-3 d-flex">
          <input
            type="text"
            placeholder="New Column Name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            className="form-control me-2"
          />
          <select
            value={newColumnType}
            onChange={(e) => setNewColumnType(e.target.value)}
            className="form-select me-2"
          >
            {COLUMN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleAddColumn}>
            <i className="bi bi-plus"></i> Add Column
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr className="fitContent">
              {tableStructure.columns?.map((col, index) => (
                <th key={col}>
                  <div className="mb-2 card">
                    <div className="card-body">
                      <span>{col}</span>
                      {isEditing ? (
                        <>
                          <select
                            value={renderColumnType(index)}
                            onChange={(e) =>
                              handleChangeColumnType(index, e.target.value)
                            }
                            className="form-select d-inline-block ms-3"
                            style={{ width: "auto" }}
                          >
                            {COLUMN_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {[
                            "int",
                            "float",
                            "addition",
                            "multiplication",
                            "division",
                            "substraction",
                          ].includes(renderColumnType(index)) && (
                            <div className="form-check mt-2">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={columnsToTotal[col] || false}
                                onChange={() => toggleColumnTotal(col)}
                                id={`total-toggle-${col}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`total-toggle-${col}`}
                              >
                                Include in totals
                              </label>
                            </div>
                          )}
                        </>
                      ) : (
                        <span>
                          {" "}
                          -{" "}
                          <span className="text-muted">
                            ({renderColumnType(index)})
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteColumn(col)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-secondary ms-1"
                        onClick={() => handleMoveColumn(col, "left")}
                        disabled={tableStructure.columns.indexOf(col) === 0}
                      >
                        <i className="bi bi-arrow-left"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-secondary ms-1"
                        onClick={() => handleMoveColumn(col, "right")}
                        disabled={
                          tableStructure.columns.indexOf(col) ===
                          tableStructure.columns.length - 1
                        }
                      >
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  )}
                </th>
              ))}
              {isEditing ? <th>Actions</th> : ""}
            </tr>
          </thead>
          <tbody>
            {tableValues.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tableStructure.columns?.map((col, index) => (
                  <td key={col}>
                    {isEditing ? (
                      row[tableStructure.columns[0]] === "TOTAL" ? (
                        index !== 0 &&
                        (renderColumnType(index) === "string" ||
                          renderColumnType(index) === "boolean") ? (
                          ""
                        ) : [
                            "int",
                            "float",
                            "addition",
                            "substraction",
                            "multiplication",
                            "division",
                          ].includes(renderColumnType(index)) &&
                          !columnsToTotal[col] ? (
                          ""
                        ) : renderColumnType(index).toLowerCase() ===
                          "boolean" ? (
                          <input
                            type="checkbox"
                            checked={row[col] || false}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                col,
                                e.target.checked.toString()
                              )
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[col] || ""}
                            className="form-control"
                            placeholder={`Enter ${col}`}
                            onChange={(e) =>
                              handleCellChange(rowIndex, col, e.target.value)
                            }
                          />
                        )
                      ) : renderColumnType(index).toLowerCase() ===
                        "boolean" ? (
                        <input
                          type="checkbox"
                          checked={row[col] || false}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              col,
                              e.target.checked.toString()
                            )
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          value={row[col] || ""}
                          className="form-control"
                          placeholder={`Enter ${col}`}
                          onChange={(e) =>
                            handleCellChange(rowIndex, col, e.target.value)
                          }
                        />
                      )
                    ) : row[tableStructure.columns[0]] === "TOTAL" ? (
                      index !== 0 &&
                      (renderColumnType(index) === "string" ||
                        renderColumnType(index) === "boolean") ? (
                        ""
                      ) : ["int", "float"].includes(renderColumnType(index)) &&
                        !columnsToTotal[col] ? (
                        ""
                      ) : renderColumnType(index).toLowerCase() ===
                        "boolean" ? (
                        row[col] ? (
                          <i className="bi bi-check text-success"></i>
                        ) : (
                          <i className="bi bi-x text-danger"></i>
                        )
                      ) : renderColumnType(index) === "total" ||
                        ["int", "float"].includes(renderColumnType(index)) ? (
                        Number(row[col]).toFixed(2)
                      ) : (
                        row[col] || ""
                      )
                    ) : renderColumnType(index).toLowerCase() === "boolean" ? (
                      row[col] ? (
                        <i className="bi bi-check text-success"></i>
                      ) : (
                        <i className="bi bi-x text-danger"></i>
                      )
                    ) : renderColumnType(index) === "total" ||
                      ["int"].includes(renderColumnType(index)) ? (
                      Number(row[col]).toFixed(2)
                    ) : (
                      row[col] || ""
                    )}
                  </td>
                ))}

                {isEditing && (
                  <td className="fitContent">
                    {rowIndex > 0 && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        <i className="bi bi-trash"></i> Delete Row
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-start">
          {isEditing ? (
            <div className="d-flex gap-3">
              <div className="d-flex flex-column gap-2">
                <div>
                  <label htmlFor="rowType" className="form-label me-2">
                    Row Type:
                  </label>
                  <select
                    id="rowType"
                    className="form-select"
                    value={rowType}
                    onChange={(e) => setRowType(e.target.value)}
                  >
                    <option value="entry">Entry</option>
                    <option value="total">Total</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAddRow}
                >
                  <i className="bi bi-plus"></i> Add Row
                </button>
              </div>
              <div className="d-flex align-items-start gap-2">
                <button
                  className="btn btn-success  btn-sm"
                  onClick={handleSave}
                >
                  <i className="bi bi-save me-2"></i>Save
                </button>
                <button
                  className="btn btn-secondary  btn-sm"
                  onClick={handleToggleEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-2"></i>Delete
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleToggleEdit}
              >
                <i className="bi bi-pencil me-2"></i>Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdministrativeTable;
