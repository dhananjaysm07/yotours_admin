import { useGlobalStore } from "../../store/globalStore";
import IntercityComponent from "../location/addIntercity-component";
import HotelComponent from "../location/addhotel-component";
import HotelTableComponent from "../location/hoteltable-component";
import IntercityTableComponent from "../location/intercitytable-component";
import SightSeeingComponent from "../location/addsightseeing-component";
import SightseeingTableComponent from "../location/sightseeingtable-component";
import TransferComponent from "../location/transfers-component";

const LocationFormTab = () => {
  const { hotelsData ,intercityData,sightseeingData} = useGlobalStore((s) => s.location);
  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="bg-white border rounded-sm border-stroke dark:border-strokedark dark:bg-boxdark">
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">Location Details</h3>
          </div>
          <div className="p-4">
            <HotelComponent />
            {hotelsData.length > 0 && <HotelTableComponent />}
            <IntercityComponent/>
            {intercityData.length>0 && <IntercityTableComponent/>}
            <SightSeeingComponent/>
            {sightseeingData.length>0 && <SightseeingTableComponent/>}
            <TransferComponent/>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationFormTab;
