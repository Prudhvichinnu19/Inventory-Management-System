import { useState } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EditItemModal from "./EditItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Product } from "@shared/schema";

interface DataTableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  categoryFilter: string;
  sortBy: string;
  onRefresh: () => void;
}

export default function DataTable({
  products,
  isLoading,
  isError,
  searchQuery,
  categoryFilter,
  sortBy,
  onRefresh
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const itemsPerPage = 5;
  
  // Filter products based on search query and category
  const filteredProducts = products
    .filter(product => 
      (searchQuery === '' || 
       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (categoryFilter === '' || product.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortDirection === 'asc'
          ? Number(a.price) - Number(b.price)
          : Number(b.price) - Number(a.price);
      } else if (sortBy === 'stock') {
        return sortDirection === 'asc'
          ? a.stock - b.stock
          : b.stock - a.stock;
      } else if (sortBy === 'createdAt') {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handlers
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };
  
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };
  
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };
  
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Loading states
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6 text-center">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error loading products</h3>
        <p className="text-gray-500 mb-4">There was a problem fetching the product data.</p>
        <Button onClick={onRefresh}>Try Again</Button>
      </div>
    );
  }
  
  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">
          {searchQuery || categoryFilter 
            ? "Try adjusting your search or filter criteria."
            : "Add some products to get started."}
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                  <div className="flex items-center">
                    ID <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                  <div className="flex items-center">
                    Product Name <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                  <div className="flex items-center">
                    Category <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                  <div className="flex items-center">
                    Price <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={toggleSortDirection}>
                  <div className="flex items-center">
                    Stock <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-sm text-gray-500">
                    {product.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`px-2 text-xs rounded-full ${
                        product.category === 'electronics' ? 'bg-blue-100 text-blue-800' :
                        product.category === 'furniture' ? 'bg-green-100 text-green-800' :
                        product.category === 'clothing' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    ${Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`px-2 text-xs rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(product)}
                      className="text-primary hover:text-blue-900 mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button 
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                </span>{" "}
                of <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="relative inline-flex items-center px-4 py-2"
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <EditItemModal 
        isOpen={editModalOpen} 
        onClose={closeEditModal} 
        product={selectedProduct}
        onRefresh={onRefresh}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen} 
        onClose={closeDeleteModal} 
        product={selectedProduct}
        onRefresh={onRefresh}
      />
    </>
  );
}
