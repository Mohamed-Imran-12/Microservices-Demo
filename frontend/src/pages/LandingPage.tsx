import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Shield, BarChart3, Users, Truck,
  Star, ArrowRight, CheckCircle, Zap, Lock, HeadphonesIcon,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Seamless Shopping',
    description: 'Browse thousands of products, add to cart, and checkout in seconds with a smooth, intuitive experience.',
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'JWT-based authentication with role-based access control keeps your account and data protected.',
  },
  {
    icon: BarChart3,
    title: 'Admin Analytics',
    description: 'Powerful real-time analytics dashboard gives admins full visibility into revenue, orders, and trends.',
  },
  {
    icon: Truck,
    title: 'Order Management',
    description: 'Track your orders from placement to delivery. Admins can confirm, manage, and monitor all orders.',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Complete user management with role-based permissions for customers and administrators.',
  },
  {
    icon: Zap,
    title: 'Microservices Architecture',
    description: 'Built on Spring Boot microservices for exceptional reliability, scalability, and performance.',
  },
];

const highlights = [
  'Browse and search products by category',
  'Add to cart and checkout instantly',
  'Track all your orders in real-time',
  'Manage your profile and preferences',
  'Secure JWT authentication',
  'Admin dashboard with live analytics',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-slate-200">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">ShopMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-slate-300 hover:text-indigo-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Zap size={14} />
            Powered by Spring Boot Microservices
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Shop Smarter.</span>
            <br />
            <span className="text-slate-100">Manage Better.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern full-stack e-commerce platform with seamless shopping, real-time order tracking,
            and a powerful admin dashboard — all secured with JWT authentication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              id="hero-get-started"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base transition-all hover:scale-105 pulse-glow"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              id="hero-login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-base transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-indigo-500/10 bg-indigo-500/3 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '10K+', label: 'Products' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              Everything you need in one platform
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              ShopMS combines a beautiful shopping experience with enterprise-grade administration tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass p-6 hover:border-indigo-500/30 transition-all hover:-translate-y-1 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-slate-100 font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer area highlight */}
      <section className="py-20 px-4 bg-indigo-500/3 border-y border-indigo-500/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
              <ShoppingBag size={12} />
              Customer Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6 leading-tight">
              A shopping experience
              <br />
              <span className="gradient-text">you'll love</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              From browsing to checkout, ShopMS makes every step feel effortless. 
              Your cart persists across sessions, orders are tracked in real time, 
              and your profile is always up to date.
            </p>
            <ul className="space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle size={16} className="text-indigo-400 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-8 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-sm">Instant Cart & Checkout</p>
                <p className="text-slate-500 text-xs mt-0.5">Add items, review, and pay — all in one flow</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-sm">Real-time Order Tracking</p>
                <p className="text-slate-500 text-xs mt-0.5">CREATED → CONFIRMED — stay informed at every step</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Star size={20} className="text-white" />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-sm">Personalised Profile</p>
                <p className="text-slate-500 text-xs mt-0.5">Manage your details, view order history anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin area highlight */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass p-8 space-y-4">
            {[
              { icon: BarChart3, label: 'Sales & Revenue Analytics', color: 'from-indigo-500 to-purple-600' },
              { icon: Package, label: 'Product & Inventory Management', color: 'from-purple-500 to-pink-600' },
              { icon: Users, label: 'User & Role Management', color: 'from-pink-500 to-rose-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={20} className="text-white" />
                </div>
                <p className="text-slate-200 font-medium text-sm">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
              <Shield size={12} />
              Admin Dashboard
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6 leading-tight">
              Full control for
              <br />
              <span className="gradient-text">administrators</span>
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Admins get a complete management suite: real-time analytics, product and inventory control,
              order management, user administration, and deep sales insights — all from a single dashboard.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              {[
                'Analytics dashboard with charts & KPIs',
                'Product catalog & inventory management',
                'Order confirmation & status control',
                'User management & role assignment',
                'Stock transaction history',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={15} className="text-purple-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 px-4 border-y border-indigo-500/10 bg-indigo-500/3">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Lock, title: 'JWT Secured', desc: 'All routes protected with JWT tokens and role-based access control' },
            { icon: Zap, title: 'Microservices', desc: 'Independent Spring Boot services for users, products, orders and analytics' },
            { icon: HeadphonesIcon, title: 'Always Available', desc: 'Reliable architecture designed for high availability and scalability' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                <item.icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="text-slate-100 font-semibold mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-600/5 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-400 mb-8">
            Create your account in seconds and start shopping — or log in if you're already a member.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              id="cta-register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all hover:scale-105"
            >
              Create Account
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              id="cta-login"
              className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Package size={12} className="text-white" />
            </div>
            <span className="font-medium text-slate-400">ShopMS</span>
          </div>
          <p>© {new Date().getFullYear()} ShopMS. A Spring Boot Microservices Demo.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
