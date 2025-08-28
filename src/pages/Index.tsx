import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CalculationsCard } from "@/components/dashboard/CalculationsCard";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

const Dashboard = () => {
  // Mock data - in real app this would come from your database
  const stats = [
    {
      title: "Total Orders",
      value: 156,
      icon: ShoppingCart,
      description: "This month",
      trend: { value: 12, isPositive: true },
      variant: "default" as const
    },
    {
      title: "Delivered Orders", 
      value: 134,
      icon: CheckCircle,
      description: "Success rate: 85.9%",
      trend: { value: 8, isPositive: true },
      variant: "success" as const
    },
    {
      title: "Returned Orders",
      value: 12,
      icon: XCircle, 
      description: "Return rate: 7.7%",
      trend: { value: -2, isPositive: false },
      variant: "destructive" as const
    },
    {
      title: "Revenue",
      value: "45,230 DA",
      icon: TrendingUp,
      description: "This month", 
      trend: { value: 15, isPositive: true },
      variant: "success" as const
    },
    {
      title: "Products",
      value: 8,
      icon: Package,
      description: "Active products",
      variant: "default" as const
    },
    {
      title: "Pending Issues",
      value: 3,
      icon: AlertTriangle,
      description: "Require attention",
      variant: "warning" as const
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your order management system.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Calculations */}
        <CalculationsCard />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
