import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CalculationsCard() {
  const { toast } = useToast();
  const [calculations, setCalculations] = useState({
    confirmedOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    notReachedOrders: 0,
    totalOrders: 0,
    adsExpense: 0,
    packagingCost: 0,
    confirmationCost: 0,
    otherExpenses: 0,
    totalRevenue: 0,
    purchaseCost: 0
  });

  const returnFee = calculations.returnedOrders * 200; // 200 DA per return
  const totalExpenses = calculations.adsExpense + calculations.packagingCost + 
                       calculations.confirmationCost + calculations.otherExpenses + 
                       calculations.purchaseCost + returnFee;
  const profit = calculations.totalRevenue - totalExpenses;
  const profitMargin = calculations.totalRevenue > 0 ? (profit / calculations.totalRevenue) * 100 : 0;

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCalculations(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleCalculate = () => {
    toast({
      title: "Calculations Updated",
      description: `Profit: ${profit.toFixed(2)} DA • Margin: ${profitMargin.toFixed(1)}%`
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Profit Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Order Statistics */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Order Statistics</h4>
            <div className="space-y-3">
              {[
                { label: "Confirmed Orders", field: "confirmedOrders" },
                { label: "Delivered Orders", field: "deliveredOrders" },
                { label: "Returned Orders", field: "returnedOrders" },
                { label: "Not Reached", field: "notReachedOrders" },
                { label: "Total Orders", field: "totalOrders" }
              ].map(({ label, field }) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-sm text-muted-foreground">{label}</Label>
                  <Input
                    id={field}
                    type="number"
                    value={calculations[field as keyof typeof calculations]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Expenses (DA)</h4>
            <div className="space-y-3">
              {[
                { label: "Ads Expense", field: "adsExpense" },
                { label: "Packaging Cost", field: "packagingCost" },
                { label: "Confirmation Cost", field: "confirmationCost" },
                { label: "Other Expenses", field: "otherExpenses" },
                { label: "Purchase Cost", field: "purchaseCost" }
              ].map(({ label, field }) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-sm text-muted-foreground">{label}</Label>
                  <Input
                    id={field}
                    type="number"
                    value={calculations[field as keyof typeof calculations]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Revenue & Results */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Revenue & Results</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="totalRevenue" className="text-sm text-muted-foreground">Total Revenue (DA)</Label>
                <Input
                  id="totalRevenue"
                  type="number"
                  value={calculations.totalRevenue}
                  onChange={(e) => handleInputChange("totalRevenue", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Fees:</span>
                    <span className="font-medium">{returnFee} DA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Expenses:</span>
                    <span className="font-medium">{totalExpenses.toFixed(2)} DA</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Net Profit:</span>
                    <span className={profit >= 0 ? "text-success" : "text-destructive"}>
                      {profit.toFixed(2)} DA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin:</span>
                    <span className={profitMargin >= 0 ? "text-success" : "text-destructive"}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">
          <DollarSign className="h-4 w-4 mr-2" />
          Update Calculations
        </Button>
      </CardContent>
    </Card>
  );
}