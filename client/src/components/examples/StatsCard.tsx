import StatsCard from '../StatsCard'
import { ShoppingBag, DollarSign, Package, AlertTriangle } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Today's Orders"
        value={24}
        icon={ShoppingBag}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Revenue"
        value="₦125,450"
        icon={DollarSign}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="Pending Orders"
        value={5}
        icon={Package}
      />
      <StatsCard
        title="Inventory Alerts"
        value={3}
        icon={AlertTriangle}
        trend={{ value: -2, isPositive: false }}
      />
    </div>
  )
}
