import { categories } from '../../lib/utils/mockData';

const Categories = () => {
  return (
    <section className='py-12'>
          <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>
                    Shop by Category
                </h2>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                     {categories.map((category) => (
                        <div 
                        key={category.id}
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer"
                        >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <h3 className="font-semibold">{category.name}</h3>
                        </div>
                    ))}
                </div>
          </div>
    </section>
  )
}

export default Categories