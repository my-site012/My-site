export default function PostAdPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
        Post Your Ad
      </h1>
      
      <form className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" className="w-full border rounded p-2" placeholder="Ad Title" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full border rounded p-2 h-32" placeholder="Ad Description"></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full border rounded p-2">
              <option>Call Girls</option>
              <option>Massage</option>
              <option>Male Escorts</option>
              <option>Trans</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input type="number" className="w-full border rounded p-2" placeholder="e.g. 5000" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select className="w-full border rounded p-2">
              <option>Select State</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select className="w-full border rounded p-2">
              <option>Select City</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
           <input type="tel" className="w-full border rounded p-2" placeholder="+91..." />
        </div>

        <button type="button" className="w-full bg-red-600 text-white font-medium py-3 rounded hover:bg-red-700 transition">
          Submit Ad
        </button>
      </form>
    </div>
  );
}
