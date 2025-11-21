import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ClientLogin from "./clientPages/ClientLogin";
import FreelancerHome from "./freelancePages/FreelancerHome";
import FreelancerSearch from "./freelancePages/FreelancerSearch";
import FreelanceJobDetails from "./freelancePages/FreelanceJobDetails";
import FreelanceRegister from "./freelancePages/FreelanceRegister";
import FreelanceLogin from "./freelancePages/FreelanceLogin";
import ClientHome from "./clientPages/ClientHome";
import AdminHome from "./adminPages/AdminHome";
import ProposalsReceived from "./clientPages/ProposalsReceived";
import AdminLogin from "./adminPages/AdminLogin";
import AdminRegister from "./adminPages/AdminRegister";
import FreelancerSentProposals from "./freelancePages/FreelancerSentProposals";
import AddJob from "./clientPages/AddJob";
import FreelanceUpdateProfile from "./freelancePages/FreelanceUpdateProfile";
import FreelanceProfile from "./freelancePages/FreelanceProfile";
import ClientRegister from "./clientPages/ClientRegister";
import AdminMgtUsers from "./adminPages/AdminMgtUsers";
import AdminGetAllJobs from "./adminPages/AdminGetAllJobs";
import AdminGetPreposals from "./adminPages/AdminGetPreposals";
import AdminEditJobs from "./adminPages/AdminEditJobs";



function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
        // Route for freelancer
          <Route path="/freelancer/register" element={<FreelanceRegister />} />
          <Route path="/freelancer/login" element={<FreelanceLogin/>}/>
          <Route path="/freelancer/freelancerHome" element={<FreelancerHome/>}/>
          <Route path="/freelancer/searchJobs" element={<FreelancerSearch/>}/>
          <Route path="/freelancer/applyJob/:id" element={<FreelanceJobDetails />} />
          <Route path="/freelancer/getPreposal" element={<FreelancerSentProposals/>}/>
          <Route path="/freelancer/updateProfile" element={<FreelanceUpdateProfile/>}/>
          <Route path="/freelancer/getProfile" element={<FreelanceProfile/>}/>

          // Route for clients 
          <Route path="/client/register" element={<ClientRegister/>}/>
          <Route path="/client/login" element={<ClientLogin/>}/>
          <Route path="/client/home" element={<ClientHome/>}/>
          <Route path="/client/preposal" element={<ProposalsReceived/>}/>
          <Route path="/client/addJob" element={<AddJob/>}/>

          //Admin route
          <Route path="/admin/home" element={<AdminHome/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/register" element={<AdminRegister/>}/>
          <Route path="/admin/userMgt" element={<AdminMgtUsers/>}/>
          <Route path="/admin/getAdminJobs" element={<AdminGetAllJobs/>}/>
          <Route path="/admin/getPreposals" element={<AdminGetPreposals/>}/>
          <Route path="/admin/editJobs/:id" element={<AdminEditJobs/>}/>
          
        </Route>
      </Routes>
    </>
  );
}

export default App;
