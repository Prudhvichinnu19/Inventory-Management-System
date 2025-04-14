import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { InsertProduct as BaseInsertProduct, Product, insertProductSchema, productCategories } from "@shared/schema";

// Extend InsertProduct type for form handling
interface InsertProduct extends Omit<BaseInsertProduct, 'price' | 'stock'> {
  price: string;
  stock: string;
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onRefresh: () => void;
}

export default function EditItemModal({ 
  isOpen, 
  onClose, 
  product, 
  onRefresh 
}: EditItemModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if we're in edit mode or create mode
  const isEditMode = !!product;
  
  // Create form with zod validation
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "0",
      stock: "0",
      description: "",
    },
  });
  
  // Update form values when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        description: product.description || "",
      });
    } else {
      form.reset({
        name: "",
        category: "",
        price: "0",
        stock: "0",
        description: "",
      });
    }
  }, [product, form]);
  
  const onSubmit = async (data: InsertProduct) => {
    setIsSubmitting(true);
    
    try {
      // Convert string values to appropriate types for API
      const apiData = {
        ...data,
        price: data.price,
        stock: data.stock
      };
      
      if (isEditMode && product) {
        // Update existing product
        await apiRequest("PUT", `/api/products/${product.id}`, apiData);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
          variant: "default",
        });
      } else {
        // Create new product
        await apiRequest("POST", "/api/products", apiData);
        toast({
          title: "Product created",
          description: "The product has been created successfully.",
          variant: "default",
        });
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <option value="" disabled>Select category</option>
                      {productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
