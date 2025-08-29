import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NotificationSystem from "./components/NotificationSystem";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoading from "./components/LoadingStates";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransitionWrapper from './components/PageTransitionWrapper';
import { usePageTransition } from './hooks/usePageTransition';
import { AuthProvider } from "./hooks/useAuth";
import { initializePWA } from "./lib/pwa";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DatabaseDemo = lazy(() => import("./components/examples/DatabaseDemo"));
const ConnectionTestPage = lazy(() => import("./pages/ConnectionTestPage"));

const AnimationDemo = lazy(() => import("./components/examples/AnimationDemo"));
const TypographyDemoPage = lazy(() => import("./pages/TypographyDemoPage"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize PWA features
    initializePWA();
  }, []);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationSystem />
        <AuthProvider>
          <BrowserRouter>
            <PageTransitionWrapper>
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/database-demo" element={<DatabaseDemo />} />
                  <Route path="/connection-test" element={<ConnectionTestPage />} />
                  <Route path="/animation-demo" element={<AnimationDemo />} />
                  <Route path="/typography-demo" element={<TypographyDemoPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransitionWrapper>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
