import ClientList from "@/app/components/(public)/client/ClientList/ClientList"
import Hero from "@/app/components/(public)/client/Hero/Hero"

function page() {
  return (
    <div>
        <Hero
        src='/next.svg'
        name='test hero component'
        text='some text'
        />
        <ClientList/>
    </div>
  )
}

export default page