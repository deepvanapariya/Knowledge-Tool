import { useState } from "react";
import axios from "../node_modules/axios";

function App() {
  const [query, setQuery] = useState({});
  const [result, setResult] = useState("");

  const handleInput = (e) => {
    console.log(e.target.name, query);
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(
        "query from app.jsx==>",
        query,
        "=====>",
        JSON.stringify(query)
      );
      const res = await axios.post("http://localhost:8080/search", query);
      console.log("front end res==>", res.data);
      setResult(res.data);
    } catch (error) {
      console.error(error);
    }

    const data = await response.text();
    console.log(data);
  };

  return (
    <>
      <form className="mt-8 flex flex-auto text-center">
        <input
          type="text"
          name="query"
          placeholder="enter your query"
          onChange={handleInput}
          className="rounded-lg border-cyan-700 text-orange-700"
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      {result ? <p dangerouslySetInnerHTML={{ __html: result }}></p> : ""}
    </>
  );
}

export default App;
