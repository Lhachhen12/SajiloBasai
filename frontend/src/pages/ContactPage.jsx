import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Clock, Users, Shield, Heart } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setIsLoading(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-100">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-600 font-medium text-sm mb-6 shadow-lg">
            <Heart className="w-4 h-4 mr-2" />
            We're here to help
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-500 to-teal-500 bg-clip-text text-transparent mb-6 leading-tight">
            Get In Touch
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Looking for the perfect room? Our expert team is here to guide you every step of the way on your rental journey.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              Expert Team
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-teal-500" />
              Trusted Service
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Phone,
              title: "Call Us",
              subtitle: "Speak with our experts",
              content: ["+977-9861774657", "+977-9809897812"],
              action: "Call Now",
              color: "blue",
              delay: 0,
              onClick: () => window.location.href = "tel:+9779861774657"
            },
            {
              icon: Mail,
              title: "Email Us",
              subtitle: "Drop us a message",
              content: ["info@sajilobasai.com", "shreejanlama0@gmail.com"],
              action: "Send Email",
              color: "green",
              delay: 100,
              onClick: () => window.open("mailto:info@sajilobasai.com", "_blank")
            },
            {
              icon: MapPin,
              title: "Visit Us",
              subtitle: "Come see us in person",
              content: ["chabahil, Kathmandu, Nepal", "Near KL tower"],
              action: "Get Directions",
              color: "teal",
              delay: 200,
              onClick: () => window.open("https://www.google.com/maps?q=chabahil+Kathmandu+Nepal", "_blank")
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl"></div>
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.subtitle}</p>
                
                <div className="space-y-1 mb-4">
                  {item.content.map((line, i) => (
                    <p key={i} className="text-gray-700 text-sm font-medium">{line}</p>
                  ))}
                </div>
                
                <button 
                  onClick={item.onClick}
                  className={`text-${item.color}-600 hover:text-${item.color}-700 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300`}
                >
                  {item.action}
                  <Send className="w-3 h-3 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Main Contact Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-20">
          <div className="grid lg:grid-cols-5">
            {/* Form Section */}
            <div className="lg:col-span-3 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-500 to-teal-500 bg-clip-text text-transparent mb-3">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>
              
              {submitted ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for reaching out. We'll respond within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 text-sm"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 text-sm"
                        placeholder="Your@gmail.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 text-sm"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 text-sm"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 text-sm resize-none"
                      placeholder="Tell us about your real estate needs..."
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Feature Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-teal-500 p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h3>
              
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    title: "Expert Team",
                    desc: "Experienced professionals ready to help"
                  },
                  {
                    icon: Clock,
                    title: "Quick Response",
                    desc: "We respond to all inquiries within 2 hours"
                  },
                  {
                    icon: Shield,
                    title: "Trusted Service",
                    desc: "Thousands of satisfied customers"
                  },
                  {
                    icon: Heart,
                    title: "Personal Touch",
                    desc: "Customized solutions for your needs"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                      <p className="text-teal-100 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;