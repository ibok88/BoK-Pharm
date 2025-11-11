import MedicationCard from '../MedicationCard'
import medicationImage1 from '@assets/generated_images/Medication_product_bottle_39d472bc.png'
import medicationImage2 from '@assets/generated_images/Medication_blister_pack_8ebe3161.png'

export default function MedicationCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MedicationCard
        id="1"
        name="Paracetamol"
        strength="500mg"
        manufacturer="Emzor Pharmaceuticals"
        price={1200}
        originalPrice={1500}
        image={medicationImage1}
      />
      <MedicationCard
        id="2"
        name="Amoxicillin"
        strength="250mg"
        manufacturer="GSK Nigeria"
        price={2500}
        image={medicationImage2}
      />
    </div>
  )
}
