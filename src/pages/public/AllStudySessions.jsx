import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import StudySessionCard from "@/components/my-components/StudySessionCard";
import Pagination from "@/shared/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const AllStudySessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialPage = parseInt(query.get("page")) || 1;
  const initialSearch = query.get("searchValue") || "";
  const initialFilter = query.get("filterBy") || "all";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [filterBy, setFilterBy] = useState(initialFilter);

  const { data: allSessionsData = {}, isLoading } = useFetchForGet(
    "public",
    ["sessions", currentPage, searchValue, filterBy],
    `/get-all-sessions?page=${currentPage}&searchValue=${searchValue}&filterBy=${filterBy}`,
    { keepPreviousData: true }
  );
  const { sessions = [], totalPages = 1 } = allSessionsData;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(
      `?page=${newPage}&searchValue=${searchValue}&filterBy=${filterBy}`
    );
  };
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };
  const handleFilter = (value) => {
    setFilterBy(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const updatedQuery = new URLSearchParams(location.search);
    setCurrentPage(parseInt(updatedQuery.get("page")) || 1);
    setSearchValue(updatedQuery.get("searchValue") || "");
    setFilterBy(updatedQuery.get("filterBy") || "all");
  }, [location.search]);


  return (
    //
    <div className="mt-10 max-w-8xl mx-auto px-4 xl:px-0" id="all-sessions">
      <Helmet>
        <title> All Sessions | Study Sphere</title>
      </Helmet>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3">
        Keep exploring and growing your knowledge.
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search by session name ..."
          value={searchValue}
          onChange={handleSearch}
          className="flex-grow"
        />
        <Select onValueChange={handleFilter} value={filterBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <StudySessionCard key={session._id} session={session} dataLoading={isLoading} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">
            No session found.
          </p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
          showFirstLast={true}
          showPageNumbers={true}
        />
      )}
    </div>
  );
};

export default AllStudySessions;
