import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";


const FreelancerSentProposals = () => {
  
 const {data,isLoading,error}=useQuery({
    queryKey:["getAllPreposals"],
    queryFn:async()=>{
          const res = await axiosInstance.get("/freelancer/getPreposal")
          return res.data
    }
    
 })
 const proposals = data?.preposal || []
 
 
 if(isLoading) return <p>Loading.....</p>
 if(error) return <p>error loading preposals...</p>
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sent Proposals
      </h1>

      {/* No Proposals */}
      {proposals.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          You haven't sent any proposals yet.
        </p>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* Job Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {item.job.title}
            </h2>

            {/* Budget & Deadline */}
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Budget:</span> ₹{item.job.budget}
            </p>
            <p className="text-gray-700 text-sm mb-3">
              <span className="font-semibold">Deadline:</span>{" "}
              {new Date(item.job.deadline).toLocaleDateString()}
            </p>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                item.status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : item.status === "accepted"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {item.status.toUpperCase()}
            </span>

            {/* Sent Date */}
            <p className="text-xs text-gray-500 mt-3">
              Sent on: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerSentProposals;
