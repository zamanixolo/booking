
function Values() {
    const values=Array(2).fill(0)
  return (
    <div className="p-[2.5em] text-center">
        <h2>Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((e,i)=>{return <div key={i}>
            <Card
            title='value'
            text='description'
            />
            </div>})}
        </div>
    </div>
  )
}

export default Values

interface CardProps {
    title: string
    text: string
  }
function Card({ title, text}: CardProps) {
  return (
    <div className="bg-white flex-shrink-0  border p-8  shadow-xl min-w-[300px] h-[300px]">    
        {/* image option */}
        <p className="mt-4 font-bold">{title}</p>
        <p className="italic">{text}</p>
    </div>
  )
}