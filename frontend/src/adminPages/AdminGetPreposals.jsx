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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10 font-semibold">
        Error: {error?.response?.data?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Freelancer Proposals</h1>

      {data?.length === 0 ? (
        <p className="text-gray-600">No proposals found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.job?.title}
              </h2>

              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Budget:</span>{" "}
                  {item.job?.budget}
                </p>
                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {item.job?.deadline}
                </p>
              </div>

              <hr className="my-3" />

              <h3 className="font-semibold text-gray-900">Freelancer Info</h3>
              <p className="text-gray-700">
                <span className="font-medium">Name:</span>{" "}
                {item.freelancer?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {item.freelancer?.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Bid Amount:</span>{" "}
                {item.bidAmount}
              </p>

              <div className="mt-4 flex justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-sm 
                  ${
                    item.status === "accepted"
                      ? "bg-green-100 text-green-600"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
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
