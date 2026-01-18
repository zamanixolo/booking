

function ContactInfo() {
  return (
    <div className="bg-white text-black rounded-xl border text-card-foreground shadow bg-background/90 text-[24px]">
    <div className="flex flex-col space-y-1.5 p-6">
    <h2>Contact Information</h2>
    </div>
    
        <div className="flex flex-col text-start w-[20em] p-[1em] text-[12px]">
        <p><strong>local</strong></p>
        <p>some location</p>
        <p><strong>contact number</strong></p>
        <p>some contact</p>
        <p><strong>email</strong></p>
        <p>some email</p>
        </div>
    
    
    </div>
  )
}

export default ContactInfo