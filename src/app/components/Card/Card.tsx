interface CardProps {
    author: string
    text: string
  }
function Card({ author, text }: CardProps) {
  return (
    <div className="bg-white/30 backdrop-blur-md flex-shrink-0 w-[calc(25%)] border p-8 bg-gray-700 text-white rounded-xl shadow-xl min-w-[300px] h-[300px]">    
        <p className="italic">{text}</p>
        <p className="mt-4 font-bold">{author}</p>
    </div>
  )
}

  export default Card