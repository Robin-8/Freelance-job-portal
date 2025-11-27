import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";

const AdminGetPreposals = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminPreposals"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/getPreposal");
      return res.data.proposals;
    },
  });

  // Skeleton Loader - Dark Theme
  if (isLoading) {
    return (
      <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-[#1c1f26] p-6 rounded-2xl border border-[#2a2e37] shadow-lg animate-pulse"
          >
            <div className="h-5 w-40 bg-[#2f3542] rounded mb-3"></div>
            <div className="h-4 w-28 bg-[#2f3542] rounded mb-2"></div>
            <div className="h-4 w-24 bg-[#2f3542] rounded mb-2"></div>
            <div className="h-4 w-20 bg-[#2f3542] rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 mt-10 font-semibold">
        Error: {error?.response?.data?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0d0f12] min-h-screen text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">
        Freelancer Proposals
      </h1>

      {data?.length === 0 ? (
        <p className="text-gray-400 text-lg">No proposals found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-[#16181d] p-6 rounded-2xl border border-[#242831] 
                         shadow-xl hover:shadow-2xl hover:border-[#3a3f4b]
                         transition-all duration-300"
            >
              {/* Job Title */}
              <h2 className="text-xl font-semibold text-white mb-2">
                {item.job?.title}
              </h2>

              {/* Job Details */}
              <div className="text-gray-300 mb-3 space-y-1 text-sm">
                <p>
                  <span className="font-medium text-gray-400">Budget:</span>{" "}
                  {item.job?.budget}
                </p>
                <p>
                  <span className="font-medium text-gray-400">Deadline:</span>{" "}
                  {item.job?.deadline}
                </p>
              </div>

              <div className="h-px w-full bg-[#2b303b] my-4"></div>

              {/* Freelancer Info */}
              <div className="space-y-1 text-sm">
                <h3 className="font-semibold text-white text-[15px]">
                  Freelancer Info
                </h3>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Name:</span>{" "}
                  {item.freelancer?.name}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Email:</span>{" "}
                  {item.freelancer?.email}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Bid Amount:</span>{" "}
                  {item.bidAmount}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-5 flex justify-end">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize tracking-wide
                    ${
                      item.status === "accepted"
                        ? "bg-green-900 text-green-300 border border-green-700"
                        : item.status === "rejected"
                        ? "bg-red-900 text-red-300 border border-red-700"
                        : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                    }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGetPreposals;
