import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch('/live_news.json')
      .then(res => res.json())
      .then(data => {
        const foundNews = data.find((n: any) => n.id === id);
        setNews(foundNews);
      })
      .catch(err => console.error("খবর লোড হতে সমস্যা হয়েছে:", err));
  }, [id]);

  const handleListen = () => {
    if (!news) return;
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const textToRead = `${news.title}। বিস্তারিত সংবাদ: ${news.details}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "bn-BD";
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      alert("আপনার ব্রাউজারটি অডিও সাপোর্ট করে না।");
    }
  };

  if (!news) {
    return <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">খবর লোড হচ্ছে...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto mt-10">
        
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-[#FF0033] transition-colors mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ফিরে যান
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-[#FF0033]/20 text-[#FF0033] rounded-full text-sm font-semibold border border-[#FF0033]/30">
              {news.category}
            </span>
            <span className="text-gray-400 text-sm">{news.time}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {news.title}
          </h1>
          
          <button 
            onClick={handleListen}
            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              isPlaying 
              ? "bg-gray-800 text-[#FF0033] border border-[#FF0033] animate-pulse" 
              : "bg-[#FF0033] text-white hover:bg-[#CC0029] hover:shadow-[0_0_20px_rgba(255,0,51,0.5)]"
            }`}
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              {isPlaying ? (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              )}
            </svg>
            {isPlaying ? "থামান" : "খবরটি শুনুন"}
          </button>
        </div>

        <div className="w-full h-[300px] md:h-[500px] relative rounded-2xl overflow-hidden mb-10 border border-gray-800">
          <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-gray-300">
            {news.details}
          </p>
        </div>

      </div>
    </div>
  );
}