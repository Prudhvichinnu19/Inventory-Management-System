import { useState } from "react";
import Header from "@/components/Header";
import DataControls from "@/components/DataControls";
import DataTable from "@/components/DataTable";
import ApiStatus from "@/components/ApiStatus";
import TestDashboard from "@/components/TestDashboard";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  // Get API status
  const apiStatus = useQuery({
    queryKey: ['/api/status'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get products from the API
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/products'],
  });
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };
  
  // Handle sort
  const handleSort = (field: string) => {
    setSortBy(field);
  };
  
  // Handle refresh button
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <Header 
        apiStatus={apiStatus.data?.status === "connected"} 
        isLoading={apiStatus.isLoading}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DataControls 
          onSearch={handleSearch}
          onCategoryChange={handleCategoryFilter}
          onSortChange={handleSort}
          onRefresh={handleRefresh}
          searchValue={searchQuery}
          categoryValue={categoryFilter}
          sortValue={sortBy}
        />
        
        <DataTable 
          products={products || []}
          isLoading={isLoading}
          isError={isError}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          onRefresh={refetch}
        />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          <ApiStatus 
            status={apiStatus.data?.status}
            lastRequest={new Date().toLocaleTimeString()}
            endpoint="/api/products"
            responseTime="124ms"
            isLoading={apiStatus.isLoading}
          />
          <TestDashboard />
        </div>
      </main>
    </div>
  );
}
