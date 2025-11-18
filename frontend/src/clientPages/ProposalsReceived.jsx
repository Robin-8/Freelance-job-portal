import React from "react";
import { User, FileText, Clock, IndianRupee } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";

const ProposalsReceived = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["proposalsReceived"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/preposal");
      return res.data;
    },
  });

  const proposals = data?.preposal || [];

  const updateMutation = useMutation({
    mutationFn: async ({ preposalId, status }) => {
      const response = await axiosInstance.patch(
        `/client/updateStatus/${preposalId}`,
        { status }
      );
      return response.data;
    },
    onSuccess:()=>{
       queryClient.invalidateQueries(['proposalsReceived'])
    }
  });
    if (isLoading) return <p>loading......</p>;
  if (error) return <p>Error loading preposals</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">Proposals Received</h1>
        <p className="text-gray-400 mt-1 text-lg">
          Review proposals submitted by freelancers for your jobs.
        </p>
      </div>

      {/* If No Proposals */}
      {proposals.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-gray-900 p-10 rounded-2xl text-center border border-gray-800">
          <p className="text-gray-400 text-lg">No proposals received yet.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
          {proposals.map((p, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 hover:shadow-xl transition-all"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {p.job?.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={16} /> Submitted:{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="flex items-center gap-1 text-green-400 font-semibold">
                  <IndianRupee size={18} /> {p.bidAmount}
                </p>
              </div>

              {/* Freelancer Info */}
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {p.freelancer?.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{p.freelancer?.email}</p>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mt-5 bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <FileText size={18} /> Cover Letter
                </h4>
                <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                  {p.coverLetter}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button onClick={()=>updateMutation.mutate({preposalId:p._id, status:'accepted'})} className="flex-1 bg-green-600 py-3 rounded-xl text-white font-semibold hover:bg-green-700 transition">
                  Accept Proposal
                </button>

                <button onClick={()=>updateMutation.mutate({preposalId:p._id, status:'rejected'})} className="flex-1 bg-red-600 py-3 rounded-xl text-white font-semibold hover:bg-red-700 transition">
                  Reject Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsReceived;
