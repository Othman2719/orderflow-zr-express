import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Eye, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdScript {
  id: string;
  name: string;
  productId: string;
  productName: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock products data (this would come from your products store)
const mockProducts = [
  { id: "1", name: "Premium Headphones" },
  { id: "2", name: "Wireless Earbuds" },
  { id: "3", name: "Smart Watch" },
  { id: "4", name: "Bluetooth Speaker" },
];

// Mock ad scripts data
const mockAdScripts: AdScript[] = [
  {
    id: "1",
    name: "Premium Headphones - Facebook Ad",
    productId: "1",
    productName: "Premium Headphones",
    content: "🎧 Experience crystal-clear sound quality!\n\n✨ Premium noise-cancelling headphones\n💰 Special offer: 2990 DA (was 4500 DA)\n📦 Free delivery to your door\n🔥 Limited time offer!\n\n📞 Order now: 0555 123 456",
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "Wireless Earbuds - Instagram Story",
    productId: "2",
    productName: "Wireless Earbuds",
    content: "🎵 True wireless freedom!\n\n⚡ Latest Bluetooth 5.0 technology\n🔋 24-hour battery life\n💧 Waterproof design\n💯 Premium sound quality\n\nPrice: 1990 DA\n📱 DM to order",
    isActive: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  }
];

export default function AdScripts() {
  const [scripts, setScripts] = useState<AdScript[]>(mockAdScripts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<AdScript | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    productId: "",
    content: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.productId || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = mockProducts.find(p => p.id === formData.productId);
    if (!product) return;

    if (editingScript) {
      // Update existing script
      setScripts(prev => prev.map(script => 
        script.id === editingScript.id 
          ? {
              ...script,
              name: formData.name,
              productId: formData.productId,
              productName: product.name,
              content: formData.content,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : script
      ));
      toast({
        title: "Success",
        description: "Ad script updated successfully"
      });
    } else {
      // Create new script
      const newScript: AdScript = {
        id: Date.now().toString(),
        name: formData.name,
        productId: formData.productId,
        productName: product.name,
        content: formData.content,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setScripts(prev => [...prev, newScript]);
      toast({
        title: "Success",
        description: "Ad script created successfully"
      });
    }

    // Reset form
    setFormData({ name: "", productId: "", content: "" });
    setIsFormOpen(false);
    setEditingScript(null);
  };

  const handleEdit = (script: AdScript) => {
    setEditingScript(script);
    setFormData({
      name: script.name,
      productId: script.productId,
      content: script.content
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setScripts(prev => prev.filter(script => script.id !== id));
    toast({
      title: "Success",
      description: "Ad script deleted successfully"
    });
  };

  const toggleActive = (id: string) => {
    setScripts(prev => prev.map(script => 
      script.id === id ? { ...script, isActive: !script.isActive } : script
    ));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Success",
      description: "Script copied to clipboard"
    });
  };

  const resetForm = () => {
    setFormData({ name: "", productId: "", content: "" });
    setIsFormOpen(false);
    setEditingScript(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ad Scripts</h1>
            <p className="text-muted-foreground">Manage advertising scripts for your products</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Script
          </Button>
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <Card>
            <CardHeader>
              <CardTitle>{editingScript ? "Edit Ad Script" : "Create New Ad Script"}</CardTitle>
              <CardDescription>
                {editingScript ? "Update the ad script details" : "Create a new advertising script for your products"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Script Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Premium Headphones - Facebook Ad"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product *</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Script Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your ad script content here..."
                    className="min-h-[150px]"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingScript ? "Update Script" : "Create Script"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Scripts List */}
        <div className="grid gap-4">
          {scripts.map((script) => (
            <Card key={script.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{script.name}</CardTitle>
                    <CardDescription>
                      Product: {script.productName} • Created: {script.createdAt}
                      {script.updatedAt !== script.createdAt && ` • Updated: ${script.updatedAt}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={script.isActive ? "default" : "secondary"}>
                      {script.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={script.isActive}
                      onCheckedChange={() => toggleActive(script.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Label className="text-sm font-medium">Script Content:</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(script.content)}
                        className="h-8 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-foreground">
                      {script.content}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(script)}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(script.content)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(script.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {scripts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Ad Scripts</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first ad script to get started with product marketing.
                </p>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Script
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}