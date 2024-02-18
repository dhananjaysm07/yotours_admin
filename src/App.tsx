import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./layout/ProtectedRoute";
import SignIn from "./pages/authentication/SignInPage";
import Loader from "./components/common/Loader";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import LayoutWithSidebar from "./layout/withSidebar";
import AllPackagesPage from "./pages/package/AllPackagesPage";
import CreatePackagePage from "./pages/package/CreatePackagePage";
import SettingPage from "./pages/settings/SettingPage";
import CreateDestinationPage from "./pages/destination/CreateDestinationPage";
import AllDestinationsPage from "./pages/destination/AllDestinationsPage";
import CreateTourPage from "./pages/tour/CreateTourPage";
import AllToursPage from "./pages/tour/AllToursPage";
import CreateAttractionPage from "./pages/attraction/CreateAttractionPage";
import AllAttractionsPage from "./pages/attraction/AllAttractionsPage";
import AttractionDetailPage from "./pages/attraction/AttractionDetailPage";
import EditTourPage from "./pages/tour/EditTourPage";
import EditDestinationPage from "./pages/destination/EditDestinationPage";
import EditAttractionPage from "./pages/attraction/EditAttractionPage";
import Dashboard from "./pages/dashboard";
import AllThingsPage from "./pages/thing/AllThingsPage";
import CreateThingPage from "./pages/thing/CreateThingPage";
import EditThingPage from "./pages/thing/EditThingPage";
import ContentPage from "./pages/content/ContentPage";
import CreateCar from "./pages/car/CreateCar";
import AllCarsPage from "./pages/car/AllCar";
import EditCarPage from "./pages/car/EditCar";

function App() {
  //page refresh at any location is leading me to root page
  const [loading, setLoading] = useState<boolean>(true);
  // console.log(import.meta.env.VITE_API_KEY);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutWithSidebar />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route
              path="package/create-package"
              element={<CreatePackagePage />}
            />
            <Route path="package/allpackages" element={<AllPackagesPage />} />
            <Route path="settings" element={<SettingPage />} />
            <Route
              path="create-destination"
              element={<CreateDestinationPage />}
            />
            <Route path="alldestinations" element={<AllDestinationsPage />} />
            <Route
              path="editdestination/:destinationId"
              element={<EditDestinationPage />}
            />

            <Route path="create-tour" element={<CreateTourPage />} />
            <Route path="alltours" element={<AllToursPage />} />
            <Route path="edittour/:tourId" element={<EditTourPage />} />

            <Route
              path="create-attraction"
              element={<CreateAttractionPage />}
            />
            <Route path="allattractions" element={<AllAttractionsPage />} />
            <Route
              path="editattraction/:attractionId"
              element={<EditAttractionPage />}
            />

            <Route path="create-thing" element={<CreateThingPage />} />
            <Route path="allthings" element={<AllThingsPage />} />
            <Route path="editthing/:thingId" element={<EditThingPage />} />
            <Route path="create-car" element={<CreateCar />} />
            <Route path="allcars" element={<AllCarsPage />} />
            <Route path="editcar/:carId" element={<EditCarPage />} />

            <Route path="content" element={<ContentPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
