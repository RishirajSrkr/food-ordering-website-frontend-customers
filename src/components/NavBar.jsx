import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Menu, X, User, ChevronDown, Apple, Leaf, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useStoreContext } from '../context/StoreContext';

export default function NavBar() {
  const dropDownRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { quantities, setQuantities, token, setToken } = useStoreContext();
  const uniqueItems = Object.values(quantities).filter(qty => qty > 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    function handleScroll() {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setIsMenuOpen(false);
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-green-50 to-lime-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center group">
              <div className="relative transform transition-transform group-hover:rotate-12 duration-300">
                <Apple size={32} className="text-green-500" />
                <Leaf size={18} className="absolute -bottom-1 -right-1 text-lime-500" />
              </div>
              <div className="ml-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent">FreshFruit</h1>
                <div className="text-xs text-gray-500 -mt-1">Farm-fresh fruits delivered!</div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Seasonal Fruits</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>

            {!token ? (
              <div className="ml-2">
                <Link to="/login" className="bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm">
                  Login
                </Link>
              </div>
            ) : (
              <div className="relative ml-3" ref={dropDownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:text-green-500 px-3 py-2 font-medium cursor-pointer group"
                >
                  <div className="bg-green-100 p-1 rounded-full mr-2 group-hover:bg-green-200 transition-colors duration-200">
                    <User size={16} className="text-green-500" />
                  </div>
                  Account
                  <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-100 overflow-hidden">
                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150 flex items-center"
                    >
                      <ShoppingBag size={14} className="mr-2 text-green-500" />
                      My Orders
                    </Link>

                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-150 flex items-center"
                    >
                      <X size={14} className="mr-2 text-green-500" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Shopping cart */}
            <Link
              to={"/cart"}
              className="text-gray-700 hover:text-green-500 px-3 py-2 font-medium flex items-center relative group"
            >
              <div className="relative transform transition-all duration-200 group-hover:scale-110">
                <ShoppingBag size={20} />
                {uniqueItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs transform transition-all duration-200 group-hover:scale-110">
                    {uniqueItems.length}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="text-gray-700 mr-4 relative group">
              <div className="relative transform transition-all duration-200 group-hover:scale-110">
                <ShoppingBag size={24} />
                {uniqueItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {uniqueItems.length}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/explore" onClick={() => setIsMenuOpen(false)}>Seasonal Fruits</MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</MobileNavLink>
            
            {!token ? (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)}>Register</MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/my-orders" onClick={() => setIsMenuOpen(false)}>My Orders</MobileNavLink>
                <div 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors duration-150 cursor-pointer"
                >
                  <X size={16} className="mr-2" />
                  Logout
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="relative text-gray-700 hover:text-green-500 px-3 py-2 font-medium transition-colors duration-200"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors duration-150"
    >
      {children}
    </Link>
  );
}