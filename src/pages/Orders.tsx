import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Filter, Eye, Edit, Send, X, Package, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getApiConfig, sendOrdersToZrExpress } from "@/lib/api-config";

// Wilaya (Algerian states) data with shipping costs
const wilayaData = [
  { id: 1, name: 'أدرار', nameEn: 'Adrar - 01', shippingCost: 870 },
  { id: 2, name: 'الشلف', nameEn: 'Chlef - 02', shippingCost: 520 },
  { id: 3, name: 'الأغواط', nameEn: 'Laghouat - 03', shippingCost: 670 },
  { id: 4, name: 'أم البواقي', nameEn: 'Oum El Bouaghi - 04', shippingCost: 520 },
  { id: 5, name: 'باتنة', nameEn: 'Batna - 05', shippingCost: 520 },
  { id: 6, name: 'بجاية', nameEn: 'Béjaïa - 06', shippingCost: 520 },
  { id: 7, name: 'بسكرة', nameEn: 'Biskra - 07', shippingCost: 570 },
  { id: 8, name: 'بشار', nameEn: 'Béchar - 08', shippingCost: 670 },
  { id: 9, name: 'البليدة', nameEn: 'Blida - 09', shippingCost: 520 },
  { id: 10, name: 'البويرة', nameEn: 'Bouira - 10', shippingCost: 520 },
  { id: 11, name: 'تمنراست', nameEn: 'Tamanrasset - 11', shippingCost: 1120 },
  { id: 12, name: 'تبسة', nameEn: 'Tébessa - 12', shippingCost: 520 },
  { id: 13, name: 'تلمسان', nameEn: 'Tlemcen - 13', shippingCost: 520 },
  { id: 14, name: 'تيارت', nameEn: 'Tiaret - 14', shippingCost: 520 },
  { id: 15, name: 'تيزي وزو', nameEn: 'Tizi Ouzou - 15', shippingCost: 520 },
  { id: 16, name: 'الجزائر العاصمة', nameEn: 'Alger - 16', shippingCost: 520 },
  { id: 17, name: 'الجلفة', nameEn: 'Djelfa - 17', shippingCost: 570 },
  { id: 18, name: 'جيجل', nameEn: 'Jijel - 18', shippingCost: 520 },
  { id: 19, name: 'سطيف', nameEn: 'Sétif - 19', shippingCost: 520 },
  { id: 20, name: 'سعيدة', nameEn: 'Saïda - 20', shippingCost: 570 },
  { id: 21, name: 'سكيكدة', nameEn: 'Skikda - 21', shippingCost: 520 },
  { id: 22, name: 'سيدي بلعباس', nameEn: 'Sidi Bel Abbès - 22', shippingCost: 520 },
  { id: 23, name: 'عنابة', nameEn: 'Annaba - 23', shippingCost: 520 },
  { id: 24, name: 'قالمة', nameEn: 'Guelma - 24', shippingCost: 520 },
  { id: 25, name: 'قسنطينة', nameEn: 'Constantine - 25', shippingCost: 520 },
  { id: 26, name: 'المدية', nameEn: 'Médéa - 26', shippingCost: 520 },
  { id: 27, name: 'مستغانم', nameEn: 'Mostaganem - 27', shippingCost: 370 },
  { id: 28, name: 'المسيلة', nameEn: 'M\'Sila - 28', shippingCost: 570 },
  { id: 29, name: 'معسكر', nameEn: 'Mascara - 29', shippingCost: 520 },
  { id: 30, name: 'ورقلة', nameEn: 'Ouargla - 30', shippingCost: 670 },
  { id: 31, name: 'وهران', nameEn: 'Oran - 31', shippingCost: 520 },
  { id: 32, name: 'البيض', nameEn: 'El Bayadh - 32', shippingCost: 670 },
  { id: 33, name: 'إليزي', nameEn: 'Illizi - 33', shippingCost: 0 },
  { id: 34, name: 'برج بوعريريج', nameEn: 'Bordj Bou Arréridj - 34', shippingCost: 520 },
  { id: 35, name: 'بومرداس', nameEn: 'Boumerdès - 35', shippingCost: 520 },
  { id: 36, name: 'الطارف', nameEn: 'El Tarf - 36', shippingCost: 520 },
  { id: 37, name: 'تندوف', nameEn: 'Tindouf - 37', shippingCost: 0 },
  { id: 38, name: 'تيسمسيلت', nameEn: 'Tissemsilt - 38', shippingCost: 0 },
  { id: 39, name: 'الوادي', nameEn: 'El Oued - 39', shippingCost: 670 },
  { id: 40, name: 'خنشلة', nameEn: 'Khenchela - 40', shippingCost: 520 },
  { id: 41, name: 'سوق أهراس', nameEn: 'Souk Ahras - 41', shippingCost: 520 },
  { id: 42, name: 'تيبازة', nameEn: 'Tipaza - 42', shippingCost: 520 },
  { id: 43, name: 'ميلة', nameEn: 'Mila - 43', shippingCost: 520 },
  { id: 44, name: 'عين الدفلى', nameEn: 'Aïn Defla - 44', shippingCost: 520 },
  { id: 45, name: 'النعامة', nameEn: 'Naâma - 45', shippingCost: 670 },
  { id: 46, name: 'عين تموشنت', nameEn: 'Aïn Témouchent - 46', shippingCost: 520 },
  { id: 47, name: 'غرداية', nameEn: 'Ghardaïa - 47', shippingCost: 620 },
  { id: 48, name: 'غليزان', nameEn: 'Relizane - 48', shippingCost: 520 },
  { id: 49, name: 'تيميمون', nameEn: 'Timimoun - 49', shippingCost: 0 },
  { id: 50, name: 'برج باجي مختار', nameEn: 'Bordj Badji Mokhtar - 50', shippingCost: 0 },
  { id: 51, name: 'أولاد جلال', nameEn: 'Ouled Djellal - 51', shippingCost: 570 },
  { id: 52, name: 'بني عباس', nameEn: 'Béni Abbès - 52', shippingCost: 870 },
  { id: 53, name: 'عين صالح', nameEn: 'In Salah - 53', shippingCost: 0 },
  { id: 54, name: 'عين قزام', nameEn: 'In Guezzam - 54', shippingCost: 0 },
  { id: 55, name: 'تقرت', nameEn: 'Touggourt - 55', shippingCost: 670 },
  { id: 56, name: 'جانت', nameEn: 'Djanet - 56', shippingCost: 0 },
  { id: 57, name: 'المغير', nameEn: 'M\'Ghair - 57', shippingCost: 0 },
  { id: 58, name: 'المنيعة', nameEn: 'Meniaa - 58', shippingCost: 0 }
];

// Mock product data (this would typically come from your Products page or API)
const mockProducts = [
  {
    id: 1,
    name: "Smartphone Pro",
    sellingPrice: 45000,
    purchasePrice: 32000,
    profit: 13000,
    status: "active",
    category: "Electronics",
    stock: 15
  },
  {
    id: 2,
    name: "Laptop Gaming",
    sellingPrice: 120000,
    purchasePrice: 85000,
    profit: 35000,
    status: "active",
    category: "Electronics",
    stock: 8
  },
  {
    id: 3,
    name: "Headphones Pro",
    sellingPrice: 8500,
    purchasePrice: 5200,
    profit: 3300,
    status: "active",
    category: "Audio",
    stock: 25
  },
  {
    id: 4,
    name: "Smart Watch",
    sellingPrice: 25000,
    purchasePrice: 18000,
    profit: 7000,
    status: "active",
    category: "Wearables",
    stock: 12
  }
];

// Mock order data
const mockOrders = [
  {
    id: 1,
    clientName: "Ahmed Benali",
    phone: "+213 555 0123",
    address: "Rue de la Paix, Alger",
    wilayaId: 16,
    wilayaName: "الجزائر العاصمة",
    productId: 1,
    productName: "Smartphone Pro",
    price: 45000,
    shippingCost: 520,
    totalPrice: 45520,
    status: "delivered",
    deliveryType: "domicile",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    clientName: "Fatima Kaid",
    phone: "+213 555 0456",
    address: "Boulevard Mohamed V, Oran",
    wilayaId: 31,
    wilayaName: "وهران",
    productId: 2,
    productName: "Laptop Gaming",
    price: 120000,
    shippingCost: 520,
    totalPrice: 120520,
    status: "confirmed",
    deliveryType: "stopdesk",
    createdAt: "2024-01-16"
  },
  {
    id: 3,
    clientName: "Omar Meziane",
    phone: "+213 555 0789",
    address: "Avenue de l'Indépendance, Constantine",
    wilayaId: 25,
    wilayaName: "قسنطينة",
    productId: 3,
    productName: "Headphones Pro",
    price: 8500,
    shippingCost: 520,
    totalPrice: 9020,
    status: "returned",
    deliveryType: "domicile",
    createdAt: "2024-01-14"
  }
];

const statusStyles = {
  confirmed: "bg-primary/10 text-primary border-primary/20",
  delivered: "bg-success/10 text-success border-success/20",
  returned: "bg-destructive/10 text-destructive border-destructive/20",
  reported: "bg-warning/10 text-warning border-warning/20"
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState(mockOrders);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const { toast } = useToast();

  // New order form state
  const [newOrder, setNewOrder] = useState({
    clientName: "",
    phone: "",
    address: "",
    wilayaId: "",
    productId: "",
    price: "",
    deliveryType: "domicile"
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get active products for dropdown
  const activeProducts = mockProducts.filter(product => product.status === "active");

  // Get product by ID
  const getProductById = (productId: number) => {
    return mockProducts.find(product => product.id === productId);
  };

  // Get wilaya by ID
  const getWilayaById = (wilayaId: number) => {
    return wilayaData.find(wilaya => wilaya.id === wilayaId);
  };

  // Handle product selection change
  const handleProductChange = (productId: string) => {
    const product = getProductById(parseInt(productId));
    if (product) {
      setNewOrder({
        ...newOrder,
        productId,
        price: product.sellingPrice.toString()
      });
    }
  };

  // Handle wilaya selection change
  const handleWilayaChange = (wilayaId: string) => {
    setNewOrder({
      ...newOrder,
      wilayaId
    });
  };

  // Handle edit product selection change
  const handleEditProductChange = (productId: string) => {
    const product = getProductById(parseInt(productId));
    if (product && selectedOrder) {
      const wilaya = getWilayaById(selectedOrder.wilayaId);
      const shippingCost = wilaya ? wilaya.shippingCost : 0;
      const totalPrice = product.sellingPrice + shippingCost;
      
      setSelectedOrder({
        ...selectedOrder,
        productId: parseInt(productId),
        productName: product.name,
        price: product.sellingPrice,
        totalPrice
      });
    }
  };

  // Handle edit wilaya selection change
  const handleEditWilayaChange = (wilayaId: string) => {
    if (selectedOrder) {
      const wilaya = getWilayaById(parseInt(wilayaId));
      const shippingCost = wilaya ? wilaya.shippingCost : 0;
      const totalPrice = selectedOrder.price + shippingCost;
      
      setSelectedOrder({
        ...selectedOrder,
        wilayaId: parseInt(wilayaId),
        wilayaName: wilaya ? wilaya.name : "",
        shippingCost,
        totalPrice
      });
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkSendToZrExpress = async () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order to send",
        variant: "destructive"
      });
      return;
    }

    // Get API configuration from localStorage
    const apiConfig = getApiConfig();
    
    if (!apiConfig.token || !apiConfig.apiKey) {
      toast({
        title: "API Configuration Missing",
        description: "Please configure your Zr Express API credentials in Settings first.",
        variant: "destructive"
      });
      return;
    }

    setIsBulkSending(true);
    
    try {
      const selectedOrderData = orders.filter(order => selectedOrders.includes(order.id));
      
      console.log(`Sending ${selectedOrderData.length} orders via backend server...`);
      console.log('API Config:', {
        baseUrl: apiConfig.baseUrl,
        token: apiConfig.token ? '***' + apiConfig.token.slice(-4) : 'missing',
        apiKey: apiConfig.apiKey ? '***' + apiConfig.apiKey.slice(-4) : 'missing'
      });

      // Send orders via backend server
      const result = await sendOrdersToZrExpress(selectedOrderData);

      if (result.success) {
        // Update order status to "sent" for selected orders
        setOrders(prev => prev.map(order => 
          selectedOrders.includes(order.id) 
            ? { ...order, status: 'sent' }
            : order
        ));
        
        setSelectedOrders([]);
        
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending orders to Zr Express:', error);
      
      toast({
        title: "Error",
        description: `Failed to send orders to Zr Express: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsBulkSending(false);
    }
  };

  const handleAddOrder = () => {
    if (!newOrder.clientName || !newOrder.phone || !newOrder.productId || !newOrder.price || !newOrder.wilayaId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedProduct = getProductById(parseInt(newOrder.productId));
    const selectedWilaya = getWilayaById(parseInt(newOrder.wilayaId));
    
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a valid product",
        variant: "destructive"
      });
      return;
    }

    if (!selectedWilaya) {
      toast({
        title: "Error",
        description: "Please select a valid wilaya",
        variant: "destructive"
      });
      return;
    }

    const shippingCost = selectedWilaya.shippingCost;
    const totalPrice = selectedProduct.sellingPrice + shippingCost;

    const order = {
      id: orders.length + 1,
      ...newOrder,
      productId: parseInt(newOrder.productId),
      productName: selectedProduct.name,
      wilayaId: parseInt(newOrder.wilayaId),
      wilayaName: selectedWilaya.name,
      price: parseInt(newOrder.price),
      shippingCost,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrders([...orders, order]);
    setNewOrder({
      clientName: "",
      phone: "",
      address: "",
      wilayaId: "",
      productId: "",
      price: "",
      deliveryType: "domicile"
    });
    setIsNewOrderOpen(false);
    
    toast({
      title: "Success",
      description: "Order added successfully",
    });
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSendOrder = (order: any) => {
    toast({
      title: "Order Sent",
      description: `Order #${order.id} has been sent to ${order.clientName}`,
    });
  };

  const handleUpdateOrder = () => {
    if (!selectedOrder) return;

    const selectedProduct = getProductById(selectedOrder.productId);
    const selectedWilaya = getWilayaById(selectedOrder.wilayaId);
    
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a valid product",
        variant: "destructive"
      });
      return;
    }

    if (!selectedWilaya) {
      toast({
        title: "Error",
        description: "Please select a valid wilaya",
        variant: "destructive"
      });
      return;
    }

    const updatedOrder = {
      ...selectedOrder,
      productName: selectedProduct.name,
      wilayaName: selectedWilaya.name,
      shippingCost: selectedWilaya.shippingCost,
      totalPrice: selectedProduct.sellingPrice + selectedWilaya.shippingCost
    };

    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    ));
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    
    toast({
      title: "Success",
      description: "Order updated successfully",
    });
  };

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;
  const isIndeterminate = selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage your customer orders and deliveries</p>
          </div>
          <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Order</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={newOrder.clientName}
                    onChange={(e) => setNewOrder({...newOrder, clientName: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newOrder.phone}
                    onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wilaya">Wilaya *</Label>
                  <Select value={newOrder.wilayaId} onValueChange={handleWilayaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {wilayaData.map((wilaya) => (
                        <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                          {wilaya.nameEn} - {wilaya.shippingCost > 0 ? `${wilaya.shippingCost} DA` : 'Free'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newOrder.address}
                    onChange={(e) => setNewOrder({...newOrder, address: e.target.value})}
                    placeholder="Enter delivery address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select value={newOrder.productId} onValueChange={handleProductChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - {product.sellingPrice.toLocaleString()} DA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (DA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deliveryType">Delivery Type</Label>
                  <Select value={newOrder.deliveryType} onValueChange={(value) => setNewOrder({...newOrder, deliveryType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domicile">Domicile</SelectItem>
                      <SelectItem value="stopdesk">Stop Desk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrder}>
                  Add Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "confirmed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("confirmed")}
            >
              Confirmed
            </Button>
            <Button
              variant={statusFilter === "delivered" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("delivered")}
            >
              Delivered
            </Button>
            <Button
              variant={statusFilter === "returned" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("returned")}
            >
              Returned
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrders.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">
                      {selectedOrders.length} order(s) selected
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrders([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {/* API Status Indicator */}
                  {(() => {
                    const apiConfig = getApiConfig();
                    const hasApiConfig = apiConfig.token && apiConfig.apiKey;
                    return (
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${hasApiConfig ? 'bg-success' : 'bg-destructive'}`} />
                        <span className={hasApiConfig ? 'text-success' : 'text-destructive'}>
                          {hasApiConfig ? 'API Ready' : 'API Not Configured'}
                        </span>
                      </div>
                    );
                  })()}
                  <Button
                    onClick={handleBulkSendToZrExpress}
                    disabled={isBulkSending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isBulkSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send to Zr Express
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Grid */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Bulk Selection Checkbox */}
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => handleSelectOrder(order.id)}
                      className="mr-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer</p>
                      <p className="font-semibold text-foreground">{order.clientName}</p>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product</p>
                      <p className="font-semibold text-foreground">{order.productName}</p>
                      <p className="text-sm text-muted-foreground">{order.price.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Wilaya</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="font-semibold text-foreground">{order.wilayaName}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Shipping: {order.shippingCost.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="font-semibold text-success">{order.totalPrice.toLocaleString()} DA</p>
                      <p className="text-xs text-muted-foreground capitalize">{order.deliveryType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge 
                        variant="outline"
                        className={statusStyles[order.status as keyof typeof statusStyles]}
                      >
                        {order.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{order.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendOrder(order)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Select All Bar */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <Label className="text-sm font-medium">
                {isAllSelected ? 'Deselect All' : 'Select All'} ({filteredOrders.length} orders)
              </Label>
            </div>
            {selectedOrders.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedOrders.length} of {filteredOrders.length} selected
              </span>
            )}
          </div>
        )}

        {filteredOrders.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">No orders found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Order Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Order ID</Label>
                    <p className="font-semibold">#{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge 
                      variant="outline"
                      className={statusStyles[selectedOrder.status as keyof typeof statusStyles]}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Client Name</Label>
                  <p className="font-semibold">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Wilaya</Label>
                  <p className="font-semibold">{selectedOrder.wilayaName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="font-semibold">{selectedOrder.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Product</Label>
                  <p className="font-semibold">{selectedOrder.productName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Product Price</Label>
                    <p className="font-semibold">{selectedOrder.price.toLocaleString()} DA</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Shipping Cost</Label>
                    <p className="font-semibold">{selectedOrder.shippingCost.toLocaleString()} DA</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Price</Label>
                  <p className="font-semibold text-success">{selectedOrder.totalPrice.toLocaleString()} DA</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Delivery Type</Label>
                  <p className="font-semibold capitalize">{selectedOrder.deliveryType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                  <p className="font-semibold">{selectedOrder.createdAt}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Order Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-clientName">Client Name</Label>
                  <Input
                    id="edit-clientName"
                    value={selectedOrder.clientName}
                    onChange={(e) => setSelectedOrder({...selectedOrder, clientName: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedOrder.phone}
                    onChange={(e) => setSelectedOrder({...selectedOrder, phone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-wilaya">Wilaya</Label>
                  <Select value={selectedOrder.wilayaId?.toString() || ""} onValueChange={handleEditWilayaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a wilaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {wilayaData.map((wilaya) => (
                        <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                          {wilaya.nameEn} - {wilaya.shippingCost > 0 ? `${wilaya.shippingCost} DA` : 'Free'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={selectedOrder.address}
                    onChange={(e) => setSelectedOrder({...selectedOrder, address: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product">Product</Label>
                  <Select value={selectedOrder.productId?.toString() || ""} onValueChange={handleEditProductChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - {product.sellingPrice.toLocaleString()} DA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (DA)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedOrder.price}
                    onChange={(e) => setSelectedOrder({...selectedOrder, price: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={selectedOrder.status} onValueChange={(value) => setSelectedOrder({...selectedOrder, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-deliveryType">Delivery Type</Label>
                  <Select value={selectedOrder.deliveryType} onValueChange={(value) => setSelectedOrder({...selectedOrder, deliveryType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domicile">Domicile</SelectItem>
                      <SelectItem value="stopdesk">Stop Desk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateOrder}>
                Update Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}