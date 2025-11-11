import OrderHistoryCard from '../OrderHistoryCard'

export default function OrderHistoryCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <OrderHistoryCard
        orderId="ORD-001234"
        date="Nov 10, 2025"
        pharmacy="HealthPlus Pharmacy"
        items={3}
        total={5400}
        status="delivered"
      />
      <OrderHistoryCard
        orderId="ORD-001235"
        date="Nov 11, 2025"
        pharmacy="MedExpress"
        items={2}
        total={3200}
        status="out-for-delivery"
      />
    </div>
  )
}
