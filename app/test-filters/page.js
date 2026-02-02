// app/test-filters/page.js
import ProductFilters from '../components/products/ProductFilters';

export default function TestFilters() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Testing Product Filters</h1>
      <div className="w-64">
        <ProductFilters />
      </div>
    </div>
  );
}