import Hero from "../components/(public)/home/Hero/Hero";
import DescriptionLeft from "../components/(public)/home/DescriptionLeft/DescriptionLeft";
import DescriptionRight from "../components/(public)/home/DescriptionRight/DescriptionRight";
import Reviwes from "../components/(public)/home/Reviwes/Reviwes";
import { getAllProviders } from "../libs/providers/providers";


export default async function Home() {

  return (
    <div>
   <Hero
   src='/app/next.svg'
   name='test hero component'
   text='some text'
   />
   <Reviwes/>
   <Hero
   src='/app/next.svg'
   name='test hero component'
   text='some more hero text'
   />
   <DescriptionLeft/>
   <Hero
      src='/app/next.svg'
      name='test hero component'
      text='some more hero text'
   />
   <DescriptionRight/>
    </div>
  )
}
