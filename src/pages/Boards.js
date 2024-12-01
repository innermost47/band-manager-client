import { useEffect, useState } from "react";
import { boardService } from "../services/apiService";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardService.getBoards();
        setBoards(data);
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred");
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Boards</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group mt-4">
        {boards.map((board) => (
          <li key={board.id} className="list-group-item">
            {board.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boards;
