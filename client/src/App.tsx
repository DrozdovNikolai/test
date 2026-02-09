import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Decisions from "@/pages/Decisions";
import AutomationPage from "@/pages/AutomationPage";
import СSupportPage from "@/pages/СSupportPage";
import DevelopmentPage from "@/pages/DevelopmentPage";
import './index.css'
import DataProcessing from '@/pages/DataProcessing';
import Approval from '@/pages/Approval';
import ProfitEs from "@/pages/ProfitES";
import ProfitLs from "@/pages/ProfitLS";
import ProfitMo from "@/pages/ProfitMO";
import AboutUsPage from "@/pages/AboutUsPage";
import CookieBanner from "@/components/CookieBanner";
import PartnersPage from "@/pages/PartnersPage";

import LoadingScreen from "@/components/LoadingScreen";
import { waitForImages } from "@/lib/waitForImages";
import { useState, useEffect, Suspense, lazy } from "react";
import { statsSectionCertificateUrls } from "@/components/data/statsSectionCertificates";

const LazyHome = lazy(() => import("@/pages/Home"));
const LazyDecisions = lazy(() => import("@/pages/Decisions"));
const LazyAutomationPage = lazy(() => import("@/pages/AutomationPage"));
const LazyСSupportPage = lazy(() => import("@/pages/СSupportPage"));
const LazyDevelopmentPage = lazy(() => import("@/pages/DevelopmentPage"));
const LazyDataProcessing = lazy(() => import("@/pages/DataProcessing"));
const LazyProfitEs = lazy(() => import("@/pages/ProfitES"));
const LazyProfitLs = lazy(() => import("@/pages/ProfitLS"));
const LazyProfitMo = lazy(() => import("@/pages/ProfitMO"));
const LazyAboutUsPage = lazy(() => import("@/pages/AboutUsPage"));
const LazyPartnersPage = lazy(() => import("@/pages/PartnersPage"));
const LazyApproval = lazy(() => import("@/pages/Approval"));

function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="/automationpage" element={<AutomationPage />} />
        <Route path="/cSupportPage" element={<СSupportPage />} />
        <Route path="/developmentPage" element={<DevelopmentPage />} />
        <Route path="/dataProcessing" element={<DataProcessing />} />
        <Route path="/profitEs" element={<ProfitEs />} />
        <Route path="/profitLs" element={<ProfitLs />} />
        <Route path="/profitMo" element={<ProfitMo />} />
        <Route path="/aboutUsPage" element={<AboutUsPage />} />
        <Route path="/partnersPage" element={<PartnersPage />} />
        <Route path="/approval" element={<Approval />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let logoTimer: ReturnType<typeof setTimeout> | null = null;

    const initializeApp = async () => {
      try {
        const hasVisitedBefore = localStorage.getItem('app_has_visited');
        const isFirstVisit = !hasVisitedBefore;

        const loadPromises = [
          new Promise(resolve => setTimeout(resolve, 1200)),
          waitForImages({
            root: document.getElementById('root') ?? document,
            additionalUrls: statsSectionCertificateUrls
          })
        ];

        await Promise.all(loadPromises);

        if (!isMounted) {
          return;
        }

        if (isFirstVisit) {
          localStorage.setItem('app_has_visited', 'true');
        }

        setIsLoading(false);

        const logoDuration = isFirstVisit ? 3000 : 1000;
        logoTimer = setTimeout(() => {
          if (isMounted) {
            setShowLogo(false);
          }
        }, logoDuration);

      } catch (error) {
        console.error('Error during app initialization:', error);
        if (isMounted) {
          setIsLoading(false);
          setShowLogo(false);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
      if (logoTimer) {
        clearTimeout(logoTimer);
      }
    };
  }, []);

  const shouldShowLoader = isLoading || showLogo;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
          <CookieBanner canShow={!shouldShowLoader} />
          <LoadingScreen isLoading={shouldShowLoader} />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
