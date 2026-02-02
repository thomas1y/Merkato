

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to Merkato
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
                Discover amazing products at unbeatable prices. 
                Shop with confidence and style.
            </p>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition">
                Shop Now
            </button>
        </div>
    </section>
  )
}

export default Hero