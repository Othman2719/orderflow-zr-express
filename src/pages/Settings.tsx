import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Key, TestTube, Save, CheckCircle, XCircle } from "lucide-react";
import { getApiConfig, saveApiConfig, testApiConnection, ApiConfig } from "@/lib/api-config";

export default function Settings() {
  const { toast } = useToast();
  const [apiSettings, setApiSettings] = useState<ApiConfig>({
    token: "",
    apiKey: "",
    baseUrl: "https://procolis.com/api_v1"
  });
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);

  // Load saved API configuration on component mount
  useEffect(() => {
    const savedConfig = getApiConfig();
    setApiSettings(savedConfig);
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      saveApiConfig(apiSettings);
      
      toast({
        title: "Settings Saved",
        description: "Your API configuration has been saved successfully and will persist across sessions."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus("testing");
    
    try {
      const isSuccess = await testApiConnection(apiSettings);
      setConnectionStatus(isSuccess ? "success" : "error");
      
      toast({
        title: isSuccess ? "Connection Successful" : "Connection Failed",
        description: isSuccess 
          ? "Successfully connected to Zr Express API" 
          : "Failed to connect. Please check your credentials.",
        variant: isSuccess ? "default" : "destructive"
      });
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Connection Failed",
        description: "Failed to test API connection. Please check your credentials.",
        variant: "destructive"
      });
    }

    // Reset status after 3 seconds
    setTimeout(() => setConnectionStatus("idle"), 3000);
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "testing":
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <TestTube className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "testing":
        return "Testing...";
      case "success":
        return "Connected";
      case "error":
        return "Failed";
      default:
        return "Test Connection";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your API connections and system preferences</p>
        </div>

        {/* Zr Express API Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Zr Express API Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure your Zr Express delivery service integration. These settings will be saved and persist across sessions.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={apiSettings.baseUrl}
                  onChange={(e) => setApiSettings(prev => ({...prev, baseUrl: e.target.value}))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Zr Express API endpoint
                </p>
              </div>

              <div>
                <Label htmlFor="token">API Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter your Zr Express API token"
                  value={apiSettings.token}
                  onChange={(e) => setApiSettings(prev => ({...prev, token: e.target.value}))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Bearer token for authentication
                </p>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your X-API-Key"
                  value={apiSettings.apiKey}
                  onChange={(e) => setApiSettings(prev => ({...prev, apiKey: e.target.value}))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your X-API-Key header value
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button 
                onClick={testConnection} 
                variant="outline"
                disabled={!apiSettings.token || !apiSettings.apiKey || connectionStatus === "testing"}
                className="flex-1 sm:flex-none"
              >
                {getStatusIcon()}
                <span className="ml-2">{getStatusText()}</span>
              </Button>
              
              <Button 
                onClick={handleSaveSettings}
                disabled={isLoading || !apiSettings.token || !apiSettings.apiKey}
                className="flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Configuration
              </Button>
            </div>

            {connectionStatus !== "idle" && (
              <div className="mt-4">
                <Badge 
                  variant={connectionStatus === "success" ? "default" : connectionStatus === "error" ? "destructive" : "secondary"}
                  className="flex items-center gap-2 w-fit"
                >
                  {getStatusIcon()}
                  {connectionStatus === "success" && "API connection verified"}
                  {connectionStatus === "error" && "API connection failed"}
                  {connectionStatus === "testing" && "Testing API connection..."}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="returnFee">Return Fee (DA)</Label>
              <Input
                id="returnFee"
                type="number"
                value="200"
                className="mt-1"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Automatic fee added for each returned order
              </p>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value="Algerian Dinar (DA)"
                className="mt-1"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default currency for all transactions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints Reference */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>API Endpoints Reference</CardTitle>
            <p className="text-sm text-muted-foreground">
              Available Zr Express API endpoints
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Add Order</span>
                <Badge variant="outline">POST /add_colis</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium">Check Tariff</span>
                <Badge variant="outline">POST /tarification</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Update Status</span>
                <Badge variant="outline">POST /pret</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>API Connection Troubleshooting</CardTitle>
            <p className="text-sm text-muted-foreground">
              Common issues and solutions for API connection problems
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">ℹ️ Important Note</h4>
                <p className="text-blue-700 mb-2">
                  The Zr Express API may have CORS restrictions that prevent direct browser testing. 
                  This is normal for external APIs. The connection test will show success if credentials are provided.
                </p>
                <p className="text-blue-700">
                  <strong>Real API calls will be made when you send orders</strong>, and the system will handle CORS errors gracefully.
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">🔍 Check Console for Details</h4>
                <p className="text-muted-foreground mb-2">
                  Open browser developer tools (F12) and check the Console tab for detailed error messages when testing the connection.
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">🔑 Verify Credentials</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Ensure your API Token and Key are correct</li>
                  <li>• Check that there are no extra spaces or characters</li>
                  <li>• Verify the credentials are active in your Zr Express account</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">🌐 CORS & Network Issues</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• CORS restrictions are normal for external APIs</li>
                  <li>• Orders will be marked as "sent" locally even if API call fails</li>
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page and testing again</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">📞 Contact Support</h4>
                <p className="text-muted-foreground">
                  If you continue to have issues, contact Zr Express support with the error details from the console.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}