import React from "react";
import { useData } from "../../../context/DataContext";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { useDataStore } from "../../../store/store";
import { useNavigate } from "react-router";
import { Destination } from "../../destination/destination-card";
import { Tour } from "../../../pages/tour/AllToursPage";
import { Thing } from "../../../pages/thing/AllThingsPage";
import { Attraction } from "../../../pages/attraction/AllAttractionsPage";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { destinationListData, tourListData, attractionData, thingData } =
    useData();
  const {
    setSelectedAttraction,
    setSelectedDestination,
    setSelectedThing,
    setSelectedTour,
  } = useDataStore();
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [suggestions, setSuggestions] = React.useState<
    Array<{ id: string; name: string }>
  >([]); // Add your list of suggestions here
  const options = ["destination", "tour", "thing", "attraction"];
  const [filter, setFilter] = React.useState<string>(options[0]);
  const [suggestionList, setSuggestionList] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const navigate = useNavigate();
  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setSearchInput(userInput);

    // Filter suggestions based on user input
    const filteredSuggestions = suggestionList.filter((item) =>
      item.name.toLowerCase().includes(userInput.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setSuggestions([]); // Clear suggestions when a suggestion is clicked
  };

  React.useEffect(() => {
    setSearchInput("");
    switch (filter) {
      case "destination":
        setSuggestionList(
          destinationListData?.getDestinations.map((el) => ({
            name: el.destinationName,
            id: el.id,
          })) || []
        );
        break;
      case "tour":
        setSuggestionList(
          tourListData?.getTours.map((el) => ({
            name: el.tourTitle,
            id: el.id,
          })) || []
        );
        break;
      case "thing":
        setSuggestionList(
          thingData?.getThings.map((el) => ({
            name: el.thingTitle,
            id: el.id,
          })) || []
        );
        break;
      case "attraction":
        setSuggestionList(
          attractionData?.getAttractions.map((el) => ({
            name: el.attractionTitle,
            id: el.id,
          })) || []
        );
        break;
      default:
        setSuggestionList([]);
    }
  }, [filter, attractionData, destinationListData, thingData, tourListData]);
  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if the click is outside the suggestions box
    if (
      target.closest(".suggestions-container") === null &&
      target.closest(".select-input") === null
    ) {
      setSuggestions([]);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFilter(selected);
    // Perform any other action based on the selected option
  };
  React.useEffect(() => {
    // Add a global click event listener
    document.addEventListener("click", handleDocumentClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleOpenSingle = (id: string) => {
    switch (filter) {
      case "destination":
        setSelectedDestination(
          (destinationListData.getDestinations?.find(
            (destination) => destination.id == id
          ) as Destination) || []
        );
        navigate(`/editdestination/${id}`);
        break;
      case "tour":
        setSelectedTour(
          (tourListData.getTours?.find((tour) => tour.id == id) as Tour) || []
        );
        navigate(`edittour/${id}`);
        break;
      case "thing":
        setSelectedThing(
          (thingData.getThings?.find((thing) => thing.id == id) as Thing) || []
        );
        navigate(`editThing/${id}`);
        break;
      case "attraction":
        setSelectedAttraction(
          (attractionData.getAttractions?.find(
            (attraction) => attraction.id == id
          ) as Attraction) || []
        );
        navigate(`editattraction/${id}`);
        break;
      default:
        setSuggestionList([]);
    }
  };
  // console.log(destinationListData, tourListData, attractionData, thingData);
  return (
    <header className="sticky top-0 flex w-full bg-white z-999 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex items-center justify-between flex-grow px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 w-full h-full du-block">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 w-full h-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          {/* TODO: Add Yotours Logo */}
          {/* <Link className="flex-shrink-0 block lg:hidden" to="/">
              <img src={Logo} alt="Logo" />
            </Link> */}
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="flex">
              {/* <button className="absolute left-0 -translate-y-1/2 top-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button> */}
              <select
                value={filter}
                onChange={handleDropdownChange}
                className=" p-2  rounded-md focus:outline-none select-input"
              >
                <option value="" disabled hidden>
                  Options
                </option>
                {options.map((el) => (
                  <option value={el}>
                    {el[0].toUpperCase() + el.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Type to search..."
                value={searchInput}
                onChange={handleInputChange}
                className="w-full pr-4 bg-transparent pl-9 focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 left-0  mt-10 w-full max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md suggestions-container">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        handleSuggestionClick(suggestion.name);
                        handleOpenSingle(suggestion.id);
                      }}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          {/* <DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
