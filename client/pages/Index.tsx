import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import {
  Zap,
  Shield,
  Gauge,
  Settings,
  Wrench,
  Award,
  Users,
  Clock,
  ArrowRight,
  Code2,
  Cpu,
  Battery,
  Monitor,
  CheckCircle,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
} from "lucide-react";
import ModernNavBar from "../components/ModernNavBar";
import ModernHeroSection from "../components/ModernHeroSection";
import { ModernFooter } from "../components/ModernFooter";
import { ModernButton } from "../components/ui/modern-button";
import {
  ModernCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardGrid,
  ServiceCard,
  ProductCard,
} from "../components/ui/modern-card";
import { ModernInput, ModernTextarea } from "../components/ui/modern-input";
import { Service, Product } from "../../shared/api";
import { testimonials } from "../data/testimonials";
import { toast } from "sonner";
import { getSocket } from "../lib/socket";

export default function Index() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companyStats, setCompanyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // SEO optimization for homepage
  useSEO({
    title: 'Nolads Engineering - Industrial Electrical Engineering Services',
    description: 'Leading electrical engineering company specializing in power systems design, industrial automation, safety solutions, and performance monitoring for industrial applications.',
    keywords: 'electrical engineering, power systems design, industrial automation, safety solutions, electrical safety, PLC programming, SCADA systems, power distribution, electrical consulting',
    ogTitle: 'Nolads Engineering - Power Your Industrial Future',
    ogDescription: 'Expert electrical engineering services for industrial applications. Power systems, automation, safety solutions, and monitoring systems.',
    ogUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nolads Engineering",
      "description": "Leading electrical engineering services for industrial applications",
      "url": "https://www.noladseng.com",
      "logo": "https://cdn.builder.io/api/v1/image/assets%2F3c0fcc38dd884921bc700a3cf9b78d45%2Ff9ea4eec89994d938666cc0285e37bae?format=webp&width=800",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "sameAs": [],
      "service": [
        {
          "@type": "Service",
          "name": "Electrical Engineering",
          "description": "Professional team delivers enterprise scalable electrical systems that guarantee safety and quality"
        },
        {
          "@type": "Service", 
          "name": "Generator Installations",
          "description": "Generator division ensures contingency plan to avoid downtime from power failure"
        },
        {
          "@type": "Service",
          "name": "Civil Engineering", 
          "description": "Water & Sanitation and Power-line projects building capacity and expertise"
        },
        {
          "@type": "Service",
          "name": "Building Construction",
          "description": "Civil engineering and building construction for residential, commercial and institutional projects"
        }
      ]
    }
  });

  const handleProductSelection = (id: string, selected: boolean) => {
    setSelectedProducts((prev) =>
      selected ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  // API fetch functions
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?featured=true&limit=4');
      const data = await response.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };


  const fetchCompanyStats = async () => {
    try {
      const response = await fetch('/api/company/stats');
      const data = await response.json();
      if (data.success) {
        setCompanyStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching company stats:', error);
    }
  };

  // Load data on component mount

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchServices(),
        fetchProducts(),
        fetchCompanyStats()
      ]);
      setLoading(false);
    };
    loadData();

    // WebSocket: Listen for real-time product updates
    const socket = getSocket();
    socket.on('products:update', () => {
      fetchProducts();
      toast.info('Product list updated in real-time');
    });
    return () => {
      socket.off('products:update');
    };
  }, []);


  const stats = [
    { icon: Globe, value: "30+", label: "Cities Covered" },
    { icon: Users, value: "500+", label: "Our Work Force" },
    { icon: Building, value: "100+", label: "Client Base" },
    { icon: Award, value: "1000+", label: "Completed Projects" },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col">
      <ModernNavBar />

      {/* Hero Section */}
      <ModernHeroSection />

      {/* Services Section */}
      <section id="services" className="section bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="bg-grid absolute inset-0" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-7 shadow-lg animate-scale-in-bounce delay-200">
              <Settings className="w-4 h-4 text-yellow-400 animate-float-fast" />
              <span>Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-7 leading-tight animate-fade-in-up delay-300">
              Engineering Services That
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text block mt-1.5 animate-gradient-shift"> Power Success</span>
            </h2>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                From initial design to ongoing maintenance, our comprehensive
                engineering services ensure your electrical systems operate at
                peak performance with maximum safety and efficiency.
              </p>
            </div>
          </div>

          <div className="relative">
            <CardGrid cols={4} gap="lg">
              {loading ? (
                // Enhanced loading skeleton with stagger animation
                Array.from({ length: 4 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="animate-pulse-slow"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ModernCard className="card-hover">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-4 animate-shimmer"></div>
                        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-2 animate-shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-4 animate-shimmer"></div>
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"
                              style={{ animationDelay: `${i * 100}ms` }}
                            ></div>
                          ))}
                        </div>
                      </CardContent>
                    </ModernCard>
                  </div>
                ))
              ) : (
                services.slice(0, 4).map((service, index) => (
                  <div
                    key={service.id || index}
                    className="group animate-fade-in-up hover-lift"
                    style={{ animationDelay: `${600 + (index * 150)}ms` }}
                  >
                    <ServiceCard
                      icon={Zap}
                      title={service.name}
                      description={service.short_description || service.description}
                      features={Array.isArray(service.features) ? service.features : []}
                      className="card-interactive transform transition-all duration-500 hover:scale-105 hover:rotate-1"
                      action={
                        <Link to={`/services/${service.id || ''}`}>
                          <ModernButton
                            variant="outline"
                            size="sm"
                            className="w-full bg-yellow-500 text-black hover:bg-yellow-400 transition-all duration-300 hover:scale-110 hover:shadow-lg group-hover:animate-pulse-glow"
                          >
                            Learn More
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </ModernButton>
                        </Link>
                      }
                    />
                  </div>
                ))
              )}
          </CardGrid>
        </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-10 animate-float-slow" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-float-medium" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-5 py-2.5 rounded-full text-sm font-semibold mb-7 shadow-lg animate-scale-in-bounce">
              <Code2 className="w-4 h-4 animate-rotate-in" />
              Our Products
            </div>
            <div className="animate-fade-in-up delay-200">
              <h2 className="text-4xl lg:text-5xl font-bold mb-7 leading-tight">
                <span className="text-yellow-300 block animate-slide-in-left">Industrial-Grade</span>
                <span className="text-white animate-slide-in-right delay-300"> Electrical Products</span>
              </h2>
            </div>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Browse our comprehensive catalog of electrical products designed
                for demanding industrial environments. Select products for your
                custom quote.
              </p>
            </div>
          </div>

          <div className="relative">
            <CardGrid cols={4} gap="lg" className="mb-10">
              {products.map((product, index) => {
                const productId = String(product.id);
                const isSelected = selectedProducts.includes(productId);
                return (
                  <div
                    key={productId}
                    className="group animate-zoom-in hover-lift"
                    style={{ animationDelay: `${700 + (index * 100)}ms` }}
                  >
                    <ProductCard
                      image={product.images ? product.images[0] : "/placeholder.svg"}
                      title={product.name}
                      price={typeof product.price === "number" ? product.price.toString() : product.price}
                      description={product.description}
                      className={`card-interactive transform transition-all duration-500 hover:scale-105 border-2 border-transparent hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/20 ${
                        isSelected
                          ? "ring-2 ring-yellow-500 ring-offset-2 border-yellow-400/50 shadow-xl shadow-yellow-400/30"
                          : ""
                      }`}
                      onClick={() =>
                        handleProductSelection(
                          productId,
                          !isSelected,
                        )
                      }
                      action={
                        <ModernButton
                          variant={isSelected ? "primary" : "outline"}
                          size="sm"
                          className={`w-full transition-all duration-300 transform hover:scale-110 ${
                            isSelected
                              ? "bg-yellow-500 text-blue-900 hover:bg-yellow-400 animate-pulse-glow shadow-lg shadow-yellow-400/50"
                              : "bg-white/10 hover:bg-yellow-400 hover:text-blue-900 border-yellow-400/50"
                          }`}
                        >
                          {isSelected ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 animate-bounce-in" />
                              Selected
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                              <span>Select</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          )}
                        </ModernButton>
                      }
                    />
                  </div>
                );
              })}
          </CardGrid>

          {selectedProducts.length > 0 && (
            <div className="animate-bounce-in-up">
              <ModernCard
                variant="featured"
                className="text-center border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/20 backdrop-blur-sm bg-gradient-to-br from-yellow-50/80 via-white to-yellow-50/60"
              >
                <CardContent className="py-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse-glow">
                      <CheckCircle className="w-6 h-6 text-blue-900 animate-heartbeat" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 animate-typewriter">
                    {selectedProducts.length} Product
                    {selectedProducts.length !== 1 ? "s" : ""} Selected
                  </h3>
                  <p className="text-slate-600 mb-6 animate-fade-in-up delay-300">
                    Ready to get a custom quote for your selected products?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact">
                      <ModernButton 
                        variant="primary" 
                        size="lg"
                        className="group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-blue-900 font-bold transition-all duration-300 hover:scale-110 hover:shadow-xl"
                      >
                        Contact Us for Quote
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                      </ModernButton>
                    </Link>
                    <Link to="/products">
                      <ModernButton 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 hover:scale-105"
                      >
                        View All Products
                      </ModernButton>
                    </Link>
                  </div>
                </CardContent>
              </ModernCard>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-dots opacity-5 animate-float-slow" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-2xl animate-float-medium" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="animate-scale-in-bounce">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-7 leading-tight">
                <span className="animate-fade-in-left">Trusted by</span>
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text block mt-2 animate-gradient-shift"> Industry Leaders</span>
              </h2>
            </div>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our track record speaks for itself. See why engineering
              professionals choose Nolads for their most critical projects.
            </p>
          </div>

          <div className="relative">
            <CardGrid cols={4} gap="lg">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group animate-scale-in-bounce hover-lift"
                  style={{ animationDelay: `${700 + (index * 200)}ms` }}
                >
                  <ModernCard className="card-interactive bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-700/50 text-center hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 hover:border-yellow-400/50 relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="py-12 relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:shadow-yellow-400/50 animate-float-medium group-hover:animate-pulse-glow transition-all duration-500">
                        <stat.icon className="w-10 h-10 text-blue-900 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="text-5xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-500">
                        {/* Animated counter would go here - for now using static value */}
                        <span className="animate-bounce-in delay-1000">
                          {stat.value}
                        </span>
                      </div>
                      
                      <div className="text-yellow-300 font-semibold text-lg group-hover:text-white transition-colors duration-500">
                        {stat.label}
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-50" />
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }} />
                    </CardContent>
                  </ModernCard>
                </div>
              ))}
            </CardGrid>
          </div>
        </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section bg-gradient-to-br from-yellow-50 via-white to-yellow-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 animate-float-slow" />
        <div className="absolute top-10 left-1/3 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-float-medium" />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-7 shadow-lg animate-scale-in-bounce">
              <Star className="w-4 h-4 text-yellow-400 animate-float-fast" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-7 leading-tight animate-fade-in-up delay-300">
              Your Trusted Partner for
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-blue-600 bg-clip-text block mt-1.5 animate-gradient-shift"> Engineering Excellence</span>
            </h2>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover the Nolads difference. We combine deep technical expertise, a relentless focus on safety, and a passion for innovation to deliver solutions that exceed expectations—every time.
              </p>
            </div>
          </div>
          <CardGrid cols={4} gap="lg">
            <ModernCard className="card-interactive bg-white border-2 border-yellow-200 text-center hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-yellow-400/30">
              <CardContent className="py-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md animate-float-medium">
                  <Award className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-xl font-bold text-blue-900 mb-2">Proven Expertise</div>
                <div className="text-slate-600">Decades of experience in industrial electrical engineering and automation.</div>
              </CardContent>
            </ModernCard>
            <ModernCard className="card-interactive bg-white border-2 border-yellow-200 text-center hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-yellow-400/30">
              <CardContent className="py-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md animate-float-medium">
                  <Shield className="w-8 h-8 text-blue-900" />
                </div>
                <div className="text-xl font-bold text-blue-900 mb-2">Unmatched Reliability</div>
                <div className="text-slate-600">On-time, on-budget delivery with a focus on safety and compliance.</div>
              </CardContent>
            </ModernCard>
            <ModernCard className="card-interactive bg-white border-2 border-yellow-200 text-center hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-yellow-400/30">
              <CardContent className="py-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md animate-float-medium">
                  <Cpu className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-xl font-bold text-blue-900 mb-2">Innovative Solutions</div>
                <div className="text-slate-600">Cutting-edge technology and creative problem-solving for every project.</div>
              </CardContent>
            </ModernCard>
            <ModernCard className="card-interactive bg-white border-2 border-yellow-200 text-center hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-yellow-400/30">
              <CardContent className="py-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md animate-float-medium">
                  <Users className="w-8 h-8 text-blue-900" />
                </div>
                <div className="text-xl font-bold text-blue-900 mb-2">Customer Focused</div>
                <div className="text-slate-600">Personalized service and long-term partnerships built on trust.</div>
              </CardContent>
            </ModernCard>
          </CardGrid>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-dots opacity-10 animate-float-slow" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl animate-float-medium" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-7 shadow-lg animate-scale-in-bounce">
              <Quote className="w-4 h-4 animate-rotate-in" />
              <span>Client Stories</span>
            </div>
            <div className="animate-fade-in-up delay-200">
              <h2 className="text-4xl lg:text-5xl font-bold mb-7 leading-tight">
                <span className="text-white block animate-slide-in-left">What Our Clients</span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text animate-slide-in-right delay-300 animate-gradient-shift"> Are Saying</span>
              </h2>
            </div>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Don't just take our word for it. Hear from industry leaders who
                have transformed their operations with our engineering solutions.
              </p>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto animate-scale-in-bounce delay-700">
            <ModernCard variant="elevated" className="overflow-hidden backdrop-blur-sm bg-white/95 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
              {/* Decorative quote marks */}
              <div className="absolute top-4 left-6 text-6xl text-blue-100 opacity-20 animate-fade-in">"</div>
              <div className="absolute bottom-4 right-6 text-6xl text-blue-100 opacity-20 rotate-180 animate-fade-in">"</div>
              
              <CardContent className="p-12 relative z-10">
                <div className="text-center relative flex items-center justify-center">
                  {/* Left arrow */}
                  <button
                    aria-label="Previous testimonial"
                    className="absolute -left-8 top-1/2 -translate-y-1/2 rounded-full bg-blue-100 hover:bg-blue-200 p-2 transition-colors shadow-md z-10"
                    onClick={() =>
                      setCurrentTestimonial((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                      )
                    }
                    type="button"
                  >
                    <ChevronLeft className="w-7 h-7 text-blue-700" />
                  </button>
                  <div className="flex-1">
                    {/* Animated stars */}
                    <div className="flex items-center justify-center gap-1 mb-8">
                      {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].rating !== "undefined"
                        ? [...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-6 h-6 text-yellow-400 fill-current animate-bounce-in"
                              style={{ animationDelay: `${800 + (i * 100)}ms` }}
                            />
                          ))
                        : null}
                    </div>
                    {/* Animated quote text */}
                    <blockquote className="text-2xl text-slate-800 mb-10 leading-relaxed font-medium animate-fade-in-up delay-1000">
                      {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].content !== "undefined"
                        ? `"${testimonials[currentTestimonial].content}"`
                        : null}
                    </blockquote>
                    {/* Enhanced author section */}
                    <div className="flex items-center justify-center gap-4 animate-slide-in-up delay-1200">
                      {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].avatar !== "undefined" ? (
                        <div className="relative group">
                        </div>
                      ) : null}
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 text-base">
                          {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].name !== "undefined"
                            ? testimonials[currentTestimonial].name
                            : null}
                        </div>
                        <div className="text-slate-600">
                          {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].title !== "undefined"
                            ? testimonials[currentTestimonial].title
                            : null}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {testimonials[currentTestimonial] && typeof testimonials[currentTestimonial].company !== "undefined"
                            ? testimonials[currentTestimonial].company
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right arrow */}
                  <button
                    aria-label="Next testimonial"
                    className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-blue-100 hover:bg-blue-200 p-2 transition-colors shadow-md z-10"
                    onClick={() =>
                      setCurrentTestimonial((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                      )
                    }
                    type="button"
                  >
                    <ChevronRight className="w-7 h-7 text-blue-700" />
                  </button>
                </div>
              </CardContent>
            </ModernCard>

            {/* Navigation (removed fallback feature array and button) */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-10" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-5 py-2.5 rounded-full text-sm font-semibold mb-7 shadow-lg animate-bounce-in">
              <Mail className="w-4 h-4" />
              Get In Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-7 leading-tight">
              <span className="text-yellow-300 block">Ready to Transform</span>
              <span className="text-white"> Your Operations?</span>
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Get started with a free consultation and discover how our
              engineering expertise can optimize your electrical systems.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14">
            <div className="animate-slide-in-left">
              <ModernCard className="card-glass border-white/30 shadow-2xl">
                <CardHeader className="text-center pb-7">
                  <CardTitle className="text-xl font-bold text-slate-900 mb-1.5">Send us a message</CardTitle>
                  <CardDescription className="text-slate-700 text-base">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project requirements"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none shadow-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <ModernButton variant="primary" size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-blue-900 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                    Send Message
                    <ArrowRight className="w-4 h-4" />
                  </ModernButton>
                </CardFooter>
              </ModernCard>
            </div>

            <div className="animate-slide-in-right space-y-7">
              <div>
                <h3 className="text-xl font-semibold text-yellow-300 mb-5">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-500 mb-1">
                        Phone
                      </div>
                      <div className="text-white">0722 611 884 / 0788 616 808</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-500 mb-1">
                        Email
                      </div>
                      <div className="text-white">
                        sales@noladseng.com
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-500 mb-1">
                        Address
                      </div>
                      <div className="text-white">
                        North Coast, Bamburi: off – Felix Mandel Avenue
                        <br />
                        P.O BOX 391 – 80100, MOMBASA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ModernCard variant="gradient">
                <CardContent className="text-center py-7">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3.5">
                    Ready for a Quote?
                  </h4>
                  <p className="text-slate-600 mb-5">
                    Get instant pricing for our most popular services and
                    products.
                  </p>
                  <Link to="/contact">
                    <ModernButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Get Custom Quote Now!
                    </ModernButton>
                  </Link>
                </CardContent>
              </ModernCard>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
}
