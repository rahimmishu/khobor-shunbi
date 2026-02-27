import { Clock, Volume2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ব্রাউজার ক্যাশ বাইপাস করে সরাসরি লাইভ ডাটা আনার ট্রিক
  useEffect(() => {
    // লিংকের শেষে ?t=... যুক্ত করায় ব্রাউজার সবসময় নতুন ফাইলটি পড়তে বাধ্য হবে
    fetch('/live_news.json?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        setNewsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("খবর লোড হতে সমস্যা হয়েছে:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-[#FF0033] rounded-full shadow-[0_0_10px_rgba(255,0,51,0.8)]"></div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">সর্বশেষ সংবাদ</h3>
      </div>

      {loading ? (
        <div className="text-center text-[#FF0033] mt-20 animate-pulse text-xl font-bold">তাজা খবর লোড হচ্ছে...</div>
      ) : newsData.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">কোনো খবর পাওয়া যায়নি। দয়া করে Python স্ক্রিপ্টটি আবার রান করুন।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news, idx) => (
            <Link key={news.id} to={`/news/${news.id}`} className="block group">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-[0_10px_30px_rgba(255,0,51,0.15)] hover:border-[#FF0033]/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-80"></div>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#FF0033]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,0,51,0.4)]">
                      {news.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-transparent to-[#0B0F19]/80 -mt-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#FF0033]" /> {news.time}
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-gray-100 mb-6 line-clamp-3 group-hover:text-[#FF0033] transition-colors duration-300 leading-snug">
                    {news.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                      বিস্তারিত <ChevronRight className="w-4 h-4" />
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); 
                        alert('ভেতরের পেজে গিয়ে খবরটি শুনুন!');
                      }}
                      className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#FF0033] hover:bg-red-600 px-4 py-2 rounded-full transition-all shadow-[0_0_10px_rgba(255,0,51,0.4)] hover:shadow-[0_0_15px_rgba(255,0,51,0.7)] transform hover:-translate-y-0.5"
                    >
                      <Volume2 className="w-4 h-4" /> শুনুন
                    </button>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}