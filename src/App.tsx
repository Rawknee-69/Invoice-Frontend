import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import {
  Home,
  Page404,
  LandingPage,
  InvoicesPage,
  EstimatesPage,
  ExpensesPage,
  ReportsPage,
  Login,
  AuthProvider,
  ProtectedRoute,
} from "./index";
// import DebugUser from "./components/DebugUser";

import { ThemeProvider } from "./index";
import { register } from "swiper/element/bundle";
import ReactGA from "react-ga4";
import { Toaster } from "react-hot-toast";

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
      <AuthProvider>
        <ThemeProvider>
          <TrackPageViews />
          <div style={{ minHeight: "35rem" }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <InvoicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimates"
                element={
                  <ProtectedRoute>
                    <EstimatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <ExpensesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 page */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
          {/* Debug component - remove this later */}
          {/* <DebugUser /> */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
              success: {
                iconTheme: {
                  primary: "hsl(var(--primary))",
                  secondary: "hsl(var(--primary-foreground))",
                },
              },
              error: {
                iconTheme: {
                  primary: "hsl(var(--destructive))",
                  secondary: "hsl(var(--destructive-foreground))",
                },
              },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
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
