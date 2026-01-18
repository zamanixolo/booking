import Hero from "@/app/components/(public)/about/Hero/Hero"
import History from "@/app/components/(public)/about/History/History"
import Team from "@/app/components/(public)/about/Team/Team"
import Values from "@/app/components/(public)/about/Values/Values"

function page() {
    return (
      <div>
        <Hero/>
        <History/>
        <Team/>
        <Values/>
      </div>
    )
  }
  
  export default page