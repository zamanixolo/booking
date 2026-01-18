import ContactForm from "@/app/components/(public)/contact/ContactForm/ContactForm"
import ContactInfo from "@/app/components/(public)/contact/ContactInfo/ContactInfo"
import Maps from "@/app/components/(public)/contact/Maps/Maps"
import Socails from "@/app/components/(public)/contact/Socails/Socails"


function page() {
  return (
    <div className="bg-[#7F7F7F] min-h-[100vh] text-center text-[#ffffff] text-bold text-[96px]">
        <h1>Get In Touch</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-[0.5em]">
            <div className="space-y-8">
            <ContactForm/>
            <Socails/>
            </div>
            <div className="space-y-8">
            <ContactInfo/>
            <Maps/>
        </div>
        </div>
    </div>
  )
}

export default page

