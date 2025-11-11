import DeliveryPartnerCard from '../DeliveryPartnerCard'
import deliveryPartnerPhoto from '@assets/generated_images/Delivery_partner_portrait_0a43ad1a.png'

export default function DeliveryPartnerCardExample() {
  return (
    <DeliveryPartnerCard
      name="Chukwudi Okafor"
      phone="+234 812 345 6789"
      rating={4.9}
      photo={deliveryPartnerPhoto}
    />
  )
}
