import AllPackagesTable from "../../components/common/tables/AllPackagesTable";
import { useQuery } from "react-query";
import { fetchPackages } from "../../utils/apollo";
function isError(error: any): error is Error {
  return error instanceof Error;
}
const AllPackagesPage: React.FC = () => {
  const { data, error, isLoading } = useQuery(
    ["getPackages", { page: 1, limit: 10 }],
    fetchPackages
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (isError(error)) {
      return <p>Error: {error.message}</p>;
    } else {
      // Handle other types of errors or log them for debugging
      console.error(error);
      return <p>An unknown error occurred</p>;
    }
  }
  // const [getPackages, { loading, data, error }] = useLazyQuery(GET_PACKAGES);

  // const handleClick = () => {
  //   getPackages({
  //     variables: { page: 1, limit: 10 } // Adjust pagination variables as needed
  //   });
  // };
  return (
    <div className="container mx-auto mt-10">
      <h1 className="mb-8 text-2xl font-bold">All Tour Packages</h1>
      <AllPackagesTable tableItems={data.getPackages.items} />
    </div>
  );
};

export default AllPackagesPage;
