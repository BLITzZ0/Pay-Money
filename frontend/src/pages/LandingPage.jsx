import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Pay-Money</h1>
          <div className="space-x-6">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <Link to="/signup" className="hover:text-green-600">Signup</Link>
            <Link to="/login" className="hover:text-green-600">Login</Link>
            {/* <Link to="#about" className="hover:text-green-600">About</Link> */}
            {/* <Link to="#contact" className="hover:text-green-600">Contact</Link> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-green-500 text-white text-center py-20 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Pay-Money</h2>
        <p className="max-w-2xl text-lg mb-6">
          A fun banking simulation project where you can sign up, get a random starting balance,
          send money, and receive money from friends — all in a secure and interactive way!
        </p>
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="bg-white text-green-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 hover:border-green-600 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-6">About Pay-Money</h3>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Pay-Money is a simple project built to simulate basic money transfer operations in a safe
          environment. As soon as you sign up, you'll be given a random balance to start with. You
          can send money to other users or receive money from them. It’s a great way to understand
          how money transactions work — without the real-world risks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">🎯 Easy Signup</h4>
            <p className="text-gray-500">Create an account in seconds and get started instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">💰 Random Balance</h4>
            <p className="text-gray-500">Get a random starting balance to play with after signup.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-3">🔄 Send & Receive</h4>
            <p className="text-gray-500">Easily transfer funds between accounts in this simulation.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-yellow-100 py-6 text-center">
        <p className="text-gray-800 font-semibold">
          ⚠️ This is a banking simulation project. No real money is involved.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Contact & Support</h3>
        <p className="text-gray-600">
          For queries or support, reach out to us at:
        </p>
        <a
          href="mailto:ababhishek3005@gmail.com"
          className="text-green-600 font-semibold mt-2 block"
        >
          ababhishek3005@gmail.com
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-auto">
        <p>© {new Date().getFullYear()} Pay-Money. All rights reserved.</p>
      </footer>
    </div>
  );
};
