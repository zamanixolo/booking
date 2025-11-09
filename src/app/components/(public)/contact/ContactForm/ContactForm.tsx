

function ContactForm() {
  return (
    <div className="bg-white text-black rounded-xl border text-card-foreground shadow bg-background/90 text-[24px]">
        <div className="flex flex-col space-y-1.5 p-6">
        <h2>Send us a message</h2>
        </div>
        <form>
            <div className="flex flex-col text-start p-[1em]">
            <label>name</label>
            <input type="text" className="border"/>
            <label>email</label>
            <input type="email" className="border"/>
            <label>message</label>
            <textarea className="border"/>
            </div>
            <button className="bg-black text-white rounded-xl w-[92%] mb-[0.5em]">Send Message</button>
        </form>
    </div>
  )
}

export default ContactForm