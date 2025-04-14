import { useState } from "react";
import { Search, RefreshCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import EditItemModal from "./EditItemModal";

interface DataControlsProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onRefresh: () => void;
  searchValue: string;
  categoryValue: string;
  sortValue: string;
}

export default function DataControls({
  onSearch,
  onCategoryChange,
  onSortChange,
  onRefresh,
  searchValue,
  categoryValue,
  sortValue
}: DataControlsProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };
  
  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest products from the server",
      duration: 2000,
    });
  };
  
  const openNewItemModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="px-4 py-5 sm:px-6 bg-white shadow rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2 sm:mb-0">
            Products Inventory
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleRefresh}
              className="inline-flex items-center rounded-md text-white"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={openNewItemModal}
              className="inline-flex items-center rounded-md text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New Item
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative rounded-md shadow-sm flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <div className="inline-flex items-center">
            <Label htmlFor="categoryFilter" className="mr-2 text-sm font-medium text-gray-700">Category:</Label>
            <select 
              id="categoryFilter"
              value={categoryValue}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="inline-flex items-center">
            <Label htmlFor="sortBy" className="mr-2 text-sm font-medium text-gray-700">Sort by:</Label>
            <select
              id="sortBy"
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock Level</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* New Item Modal */}
      <EditItemModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        product={null}
        onRefresh={onRefresh}
      />
    </>
  );
}
