import OrderStatusTimeline from '../OrderStatusTimeline'

export default function OrderStatusTimelineExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Pending</p>
        <OrderStatusTimeline currentStatus="pending" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Confirmed</p>
        <OrderStatusTimeline currentStatus="confirmed" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Out for Delivery</p>
        <OrderStatusTimeline currentStatus="out-for-delivery" />
      </div>
    </div>
  )
}
