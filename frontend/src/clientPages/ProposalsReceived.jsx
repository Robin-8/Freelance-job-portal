import React from "react";
import { User, FileText, Clock, IndianRupee } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ProposalsReceived = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch proposals
  const { data, isLoading, error } = useQuery({
    queryKey: ["proposalsReceived"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/preposal");
      return res.data;
    },
  });

  const proposals = data?.proposals || [];

  // Mutation to update proposal status
  const updateMutation = useMutation({
    mutationFn: async ({ proposalId, status }) => {
      const res = await axiosInstance.patch(
        `/client/updateStatus/${proposalId}`,
        { status }
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Refresh proposals list
      queryClient.invalidateQueries(["proposalsReceived"]);

      // Navigate if accepted
      if (variables.status === "accepted") {
        const proposal = proposals.find((p) => p._id === variables.proposalId);

        navigate("/client/payment", {
          state: {
            proposalId: variables.proposalId,
            amount: proposal?.bidAmount,
          },
        });
      }

      // Show toast if rejected
      if (variables.status === "rejected") {
        toast.error("Proposal has been declined.");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">Proposals Received</h1>
        <p className="text-gray-400 mt-1 text-lg">
          Review proposals submitted by freelancers for your jobs.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-white text-center mt-10">Loading proposals...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mt-10">
          Error loading proposals
        </p>
      )}

      {/* Empty State */}
      {!isLoading && proposals.length === 0 && (
        <div className="max-w-4xl mx-auto bg-gray-900 p-10 rounded-2xl text-center border border-gray-800">
          <p className="text-gray-400 text-lg">No proposals received yet.</p>
        </div>
      )}

      {/* Proposals List */}
      {!isLoading && proposals.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
          {proposals.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 hover:shadow-xl transition-all"
            >
              {/* Job Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{p.job?.title}</h2>
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
                  <h3 className="text-lg font-semibold">{p.freelancer?.name}</h3>
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

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() =>
                    updateMutation.mutate({ proposalId: p._id, status: "accepted" })
                  }
                  className="flex-1 bg-green-600 py-3 rounded-xl text-white font-semibold hover:bg-green-700 transition"
                >
                  Accept Proposal
                </button>

                <button
                  onClick={() =>
                    updateMutation.mutate({ proposalId: p._id, status: "rejected" })
                  }
                  className="flex-1 bg-red-600 py-3 rounded-xl text-white font-semibold hover:bg-red-700 transition"
                >
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
