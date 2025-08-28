import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Package, Eye, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Smartphone Pro",
    description: "High-end smartphone with advanced features",
    sellingPrice: 45000,
    purchasePrice: 32000,
    profit: 13000,
    status: "active",
    ordersCount: 24,
    category: "Electronics",
    stock: 15
  },
  {
    id: 2,
    name: "Laptop Gaming",
    description: "Powerful gaming laptop for professional gamers",
    sellingPrice: 120000,
    purchasePrice: 85000,
    profit: 35000,
    status: "active",
    ordersCount: 8,
    category: "Electronics",
    stock: 8
  },
  {
    id: 3,
    name: "Headphones Pro",
    description: "Premium wireless headphones with noise cancellation",
    sellingPrice: 8500,
    purchasePrice: 5200,
    profit: 3300,
    status: "active",
    ordersCount: 15,
    category: "Audio",
    stock: 25
  },
  {
    id: 4,
    name: "Smart Watch",
    description: "Smart watch with health monitoring features",
    sellingPrice: 25000,
    purchasePrice: 18000,
    profit: 7000,
    status: "inactive",
    ordersCount: 3,
    category: "Wearables",
    stock: 0
  }
];

export default function Products() {
  const [products, setProducts] = useState(mockProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sellingPrice: "",
    purchasePrice: "",
    category: "Electronics",
    stock: "",
    status: "active"
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.sellingPrice * p.ordersCount), 0);
  const totalProfit = products.reduce((sum, p) => sum + (p.profit * p.ordersCount), 0);

  const calculateProfit = (sellingPrice: number, purchasePrice: number) => {
    return sellingPrice - purchasePrice;
  };

  const calculateMargin = (profit: number, sellingPrice: number) => {
    return Math.round((profit / sellingPrice) * 100);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sellingPrice || !newProduct.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const sellingPrice = parseInt(newProduct.sellingPrice);
    const purchasePrice = parseInt(newProduct.purchasePrice);
    const profit = calculateProfit(sellingPrice, purchasePrice);

    if (profit < 0) {
      toast({
        title: "Error",
        description: "Selling price must be higher than purchase price",
        variant: "destructive"
      });
      return;
    }

    const product = {
      id: products.length + 1,
      ...newProduct,
      sellingPrice,
      purchasePrice,
      profit,
      ordersCount: 0,
      stock: parseInt(newProduct.stock) || 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      description: "",
      sellingPrice: "",
      purchasePrice: "",
      category: "Electronics",
      stock: "",
      status: "active"
    });
    setIsAddProductOpen(false);
    
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setProducts(products.filter(p => p.id !== product.id));
    toast({
      title: "Success",
      description: `${product.name} has been deleted`,
    });
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const sellingPrice = parseInt(selectedProduct.sellingPrice);
    const purchasePrice = parseInt(selectedProduct.purchasePrice);
    const profit = calculateProfit(sellingPrice, purchasePrice);

    if (profit < 0) {
      toast({
        title: "Error",
        description: "Selling price must be higher than purchase price",
        variant: "destructive"
      });
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      profit
    };

    setProducts(products.map(product => 
      product.id === selectedProduct.id ? updatedProduct : product
    ));
    setIsEditProductOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog and pricing</p>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Wearables">Wearables</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sellingPrice">Selling Price (DA) *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                    placeholder="Enter selling price"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchasePrice">Purchase Price (DA) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={newProduct.purchasePrice}
                    onChange={(e) => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                    placeholder="Enter purchase price"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newProduct.status} onValueChange={(value) => setNewProduct({...newProduct, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-2xl font-bold text-success">{activeProducts}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">{totalRevenue.toLocaleString()} DA</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">$</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold text-success">{totalProfit.toLocaleString()} DA</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success font-bold">+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <Badge 
                        variant={product.status === "active" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Selling Price</p>
                      <p className="font-semibold text-foreground">{product.sellingPrice.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                      <p className="font-semibold text-muted-foreground">{product.purchasePrice.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profit per Unit</p>
                      <p className="font-semibold text-success">{product.profit.toLocaleString()} DA</p>
                      <p className="text-xs text-muted-foreground">
                        {calculateMargin(product.profit, product.sellingPrice)}% margin
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Orders</p>
                      <p className="font-semibold text-foreground">{product.ordersCount}</p>
                      <p className="text-xs text-muted-foreground">
                        Total: {(product.sellingPrice * product.ordersCount).toLocaleString()} DA
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(product)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Product Modal */}
        <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Product ID</Label>
                    <p className="font-semibold">#{selectedProduct.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge 
                      variant={selectedProduct.status === "active" ? "default" : "secondary"}
                    >
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                  <p className="font-semibold">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="font-semibold">{selectedProduct.description || "No description"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="font-semibold">{selectedProduct.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Selling Price</Label>
                    <p className="font-semibold">{selectedProduct.sellingPrice.toLocaleString()} DA</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Purchase Price</Label>
                    <p className="font-semibold">{selectedProduct.purchasePrice.toLocaleString()} DA</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Profit per Unit</Label>
                    <p className="font-semibold text-success">{selectedProduct.profit.toLocaleString()} DA</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Profit Margin</Label>
                    <p className="font-semibold text-success">{calculateMargin(selectedProduct.profit, selectedProduct.sellingPrice)}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stock Quantity</Label>
                    <p className="font-semibold">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Orders Count</Label>
                    <p className="font-semibold">{selectedProduct.ordersCount}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Revenue</Label>
                  <p className="font-semibold">{(selectedProduct.sellingPrice * selectedProduct.ordersCount).toLocaleString()} DA</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={selectedProduct.category} onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Wearables">Wearables</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sellingPrice">Selling Price (DA)</Label>
                  <Input
                    id="edit-sellingPrice"
                    type="number"
                    value={selectedProduct.sellingPrice}
                    onChange={(e) => setSelectedProduct({...selectedProduct, sellingPrice: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-purchasePrice">Purchase Price (DA)</Label>
                  <Input
                    id="edit-purchasePrice"
                    type="number"
                    value={selectedProduct.purchasePrice}
                    onChange={(e) => setSelectedProduct({...selectedProduct, purchasePrice: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={selectedProduct.status} onValueChange={(value) => setSelectedProduct({...selectedProduct, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>
                Update Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}