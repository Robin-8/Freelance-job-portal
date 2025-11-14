import "./App.css";
import { Routes, Route } from "react-router-dom";
import ClientRegister from "./clientPages/clientRegister";
import Layout from "./components/Layout";
import ClientLogin from "./clientPages/ClientLogin";
import FreelancerHome from "./freelancePages/FreelancerHome";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/freelancer/register" element={<ClientRegister />} />
          <Route path="/freelancer/login" element={<ClientLogin/>}/>
          <Route path="/freelancer/freelacerHome" element={<FreelancerHome/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
