import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import { Home, Page404 } from "./index";

import { ThemeProvider } from "./index";
import { register } from "swiper/element/bundle";
import ReactGA from "react-ga4";

register();

function App() {
  // usePreserveScrollOnReload();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (measurementId) {
      ReactGA.initialize(measurementId);
    }
  }, [measurementId]);

  return (
    <Router>
      <ThemeProvider>
        <TrackPageViews />
        <div style={{ minHeight: "35rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

function TrackPageViews() {
  const { pathname } = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: pathname });
  }, [pathname]);

  return null;
}

export default App;
