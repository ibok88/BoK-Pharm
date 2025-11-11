import PharmacyCard from '../PharmacyCard'

export default function PharmacyCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <PharmacyCard
        name="HealthPlus Pharmacy"
        distance="1.2 km"
        rating={4.8}
        deliveryTime="15-20 min"
        phone="+234 803 456 7890"
        availability="in-stock"
        address="23 Admiralty Way, Lekki Phase 1"
      />
      <PharmacyCard
        name="MedExpress"
        distance="2.5 km"
        rating={4.5}
        deliveryTime="25-30 min"
        phone="+234 810 234 5678"
        availability="call-to-confirm"
        address="15 Awolowo Road, Ikoyi"
      />
      <PharmacyCard
        name="Care Pharmacy"
        distance="3.8 km"
        rating={4.2}
        deliveryTime="35-40 min"
        phone="+234 901 876 5432"
        availability="out-of-stock"
        address="8 Herbert Macaulay Street, Yaba"
      />
    </div>
  )
}
