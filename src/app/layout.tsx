import { Play, Calendar, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RootLayout() {
  const [currentTime, setCurrentTime] = useState('');
  const [tickerNews, setTickerNews] = useState<any[]>([]); // নতুন স্টেট

  useEffect(() => {
    // ঘড়ির কোড
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', day: 'numeric', month: 'long', 
        hour: 'numeric', minute: '2-digit', hour12: true 
      };
      setCurrentTime(now.toLocaleDateString('bn-BD', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // লাইভ খবর এনে স্ক্রলবারে দেওয়ার কোড
    fetch('/live_news.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        // লেটেস্ট ৫টি খবর স্ক্রলবারের জন্য নিলাম
        setTickerNews(data.slice(0, 5));
      })
      .catch(err => console.error("টিকার নিউজ এরর:", err));

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans text-white selection:bg-neon-red selection:text-white flex flex-col">
      {/* ... আপনার হেডারের আগের লোগো এবং ঘড়ির কোড হুবহু থাকবে ... */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-11 h-11 bg-[#FF0033] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,0,51,0.6)] group-hover:shadow-[0_0_25px_rgba(255,0,51,0.9)] transition-all duration-300 transform group-hover:scale-105">
                <Play className="text-white w-6 h-6 fill-current ml-1" />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white flex items-center tracking-wide">
                খবর শুনবি
                <span className="text-[#FF0033] ml-1 drop-shadow-[0_0_15px_rgba(255,0,51,1)] text-3xl md:text-4xl">?</span>
              </h1>
            </Link>

            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Calendar className="w-4 h-4 text-[#FF0033]" />
              <span className="text-sm font-medium tracking-wide">{currentTime}</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="bg-[#FF0033]/10 text-[#FF0033] hover:bg-[#FF0033] hover:text-white border border-[#FF0033]/30 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_10px_rgba(255,0,51,0.2)] hover:shadow-[0_0_20px_rgba(255,0,51,0.6)]">
                <Radio className="w-4 h-4 animate-pulse" /> লাইভ রেডিও
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breaking News Ticker (Framer Motion) */}
      <div className="bg-[#FF0033]/10 border-b border-[#FF0033]/20 py-2.5 overflow-hidden flex items-center relative">
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#0B0F19] to-transparent w-20 z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#0B0F19] to-transparent w-20 z-10"></div>
        
        <div className="flex items-center px-4 z-20 absolute left-0 bg-[#0B0F19] border-r border-[#FF0033]/30 h-full">
          <span className="text-[#FF0033] font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF0033] animate-pulse shadow-[0_0_8px_rgba(255,0,51,0.8)]"></span>
            ব্রেকিং নিউজ
          </span>
        </div>
        
        <div className="pl-36 w-full overflow-hidden flex whitespace-nowrap">
          <motion.div
            className="flex gap-8 text-gray-200 text-sm md:text-base font-medium"
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {/* লাইভ খবরগুলো এখানে ম্যাপ করা হলো */}
            {tickerNews.length > 0 ? (
                tickerNews.map((news) => (
                    <span key={news.id}>• {news.title}</span>
                ))
            ) : (
                <span>• লাইভ খবর লোড হচ্ছে...</span>
            )}
            {/* লুপ কন্টিনিউ রাখার জন্য আবার একই খবরগুলো দেওয়া হলো */}
            {tickerNews.length > 0 && tickerNews.map((news) => (
                <span key={news.id + '-copy'}>• {news.title}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* AdSense Friendly Footer */}
      <footer className="bg-[#0B0F19] border-t border-white/10 mt-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} <span className="text-white font-bold">খবর শুনবি?</span> - সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium">
            <Link to="/about" className="text-gray-400 hover:text-[#FF0033] transition-colors">আমাদের সম্পর্কে</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-[#FF0033] transition-colors">প্রাইভেসি পলিসি</Link>
            <Link to="/terms" className="text-gray-400 hover:text-[#FF0033] transition-colors">শর্তাবলী</Link>
            <Link to="/contact" className="text-gray-400 hover:text-[#FF0033] transition-colors">যোগাযোগ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}