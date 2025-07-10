import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SecurityHeaders } from "@/components/ui/security-headers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SearchFood from "./pages/SearchFood";
import LogFood from "./pages/LogFood";
import AddFood from "./pages/AddFood";
import FullLog from "./pages/FullLog";
import AllFoods from "./pages/AllFoods";
import EditFood from "./pages/EditFood";
import USDASearchFood from "./pages/USDASearchFood";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityHeaders />
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Nested routes that will render inside AppLayout */}
              <Route index element={<Index />} />
              <Route path="search-food" element={<SearchFood />} />
              <Route path="log-food/:foodId" element={<LogFood />} />
              <Route path="add-food" element={<AddFood />} />
              <Route path="edit-food/:id" element={<EditFood />} />
              <Route path="full-log" element={<FullLog />} />
              <Route path="all-foods" element={<AllFoods />} />
              <Route path="usda-search" element={<USDASearchFood />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
