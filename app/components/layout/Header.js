

const Header = () => {
  return (
    <header className="sticky bg-white border-b top-0 w-full z-50">
      <div className="container mx-auto px-4">
        
       
        <div className="flex h-16 items-center justify-between">
             {/* LOGO SECTION - Left side */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-blue-600">
             merkato
          </div>
            
        </div>

        {/* SEARCH BAR - Center */}

        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                type="text"
                placeholder="Search Products..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                
                <button className="absolute right-3 top-2.5">
                    🔍
                </button>
              </div>
        </div>

        {/* NAVIGATION & USER - Right side */}

        <div className="flex items-center space-x-6 ">
             {/* CART ICON with badge */}
          <div className="relative">
              <button className="p-2">
                   🛒
              </button>

              <span className="absolute -top-1 -right-1  bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                 0
              </span>
          </div>
           
           {/* USER MENU / LOGIN */}
          <div>
              <button className="flex items-center space-x-2">
                  <span>👤</span>
                  <span className="hidden md:inline">Login</span>
              </button>
          </div>
        </div>

        </div>
        
        

      </div>
           
    </header>
  )
}

export default Header