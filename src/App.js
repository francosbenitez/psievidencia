import { useState, useEffect } from "react";
import "./assets/css/default.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home";
import PsychologistsDetail from "./views/psychologists-detail";
import Dashboard from "./views/dashboard";
import ScrollToTop from "./components/ScrollToTop";
import PsychologistsService from "./services/PsychologistsService";

function App() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [pagination, setPagination] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const fetchPsychologists = async (name, specializations) => {
    setLoading(true);
    const data = (await PsychologistsService.index(1, name, specializations))
      .data;
    setPsychologists(data.results);
    setLoading(false);
  };

  const fetchMorePsychologists = async () => {
    setLoading(true);
    const data = (await PsychologistsService.index(pagination)).data;
    setPsychologists((psychologists) => psychologists.concat(data.results));
    setLoading(false);
  };

  const handlePagination = () => {
    setPagination((pagination) => pagination + 1);
  };

  useEffect(() => {
    if (pagination > 1) {
      fetchMorePsychologists();
    }
  }, [pagination]);

  const handleUpdate = (id) => {
    setSelectedOptions(
      selectedOptions.filter((selectedOptions) => selectedOptions.id !== id)
    );
  };

  const handleAdd = (value) => {
    setSelectedOptions((oldArray) => [...oldArray, value]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    if (name !== "") {
      console.log("name", name);
      fetchPsychologists(name);
    }
  }, [name]);

  useEffect(() => {
    const selectedIds = selectedOptions.map((item) => item.id);
    fetchPsychologists(selectedIds);
  }, [selectedOptions]);

  return (
    <ScrollToTop>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                psychologists={psychologists}
                loading={loading}
                handlePagination={handlePagination}
                handleUpdate={handleUpdate}
                selectedOptions={selectedOptions}
                handleAdd={handleAdd}
                handleNameChange={handleNameChange}
              />
            }
          />
          <Route path="/psychologists">
            {psychologists.map((psychologist) => (
              <Route
                key={psychologist.id}
                path={"/psychologists/" + psychologist.id}
                element={<PsychologistsDetail psychologist={psychologist} />}
              />
            ))}
          </Route>
          <Route
            path="/dashboard"
            element={<Dashboard psychologists={psychologists} />}
          />
        </Routes>
      </div>
    </ScrollToTop>
  );
}

export default App;
