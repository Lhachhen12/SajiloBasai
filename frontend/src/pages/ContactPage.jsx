import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  // Animation variants
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're here to help you find your perfect home. Whether you have questions about properties, 
            neighborhoods, or the buying process, our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
          >
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Phone</h3>
            <p className="text-gray-600 mb-1">+977-9861774657</p>
            <p className="text-gray-600">+977-9809897812</p>
            <a href="tel:+97714123456" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
              Call Now
            </a>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
          >
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Email</h3>
            <p className="text-gray-600 mb-1">info@sajilobasai.com</p>
            <p className="text-gray-600">shreejanlama0@.com</p>
            <a href="mailto:info@sajilobasai.com" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
              Email Us
            </a>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 text-center"
          >
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Office</h3>
            <p className="text-gray-600 mb-1">Kathmandu, Nepal</p>
            <p className="text-gray-600">Open: 9:00 AM - 6:00 PM</p>
            <a href="#" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
              Get Directions
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>
              
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="mb-4">Thank you for contacting us. We'll respond within 24 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-green-600 hover:text-green-700 font-medium underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="Tell us about your real estate needs..."
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition ${isLoading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
            <div className="hidden lg:block relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80")'
                }}
              >
                <div className="absolute inset-0 bg-primary-600 bg-opacity-20"></div>
              </div>
              <div className="relative h-full p-10 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-4">Why Contact Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-white">Personalized property recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-white">Expert advice on neighborhoods</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-white">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-white">No obligation consultations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;