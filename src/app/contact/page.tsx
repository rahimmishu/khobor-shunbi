export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300 font-sans">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-[#FF0033] pl-3">যোগাযোগ (Contact Us)</h1>
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg">
        <p className="mb-8 text-lg text-gray-400">যেকোনো মতামত, পরামর্শ, বিজ্ঞাপনের আবেদন বা কপিরাইট সংক্রান্ত অভিযোগের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।</p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-[#0B0F19] p-4 rounded-xl border border-gray-800">
             <div className="w-12 h-12 bg-[#FF0033]/20 text-[#FF0033] rounded-full flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(255,0,51,0.2)]">📧</div>
             <div>
               <h3 className="text-white font-bold text-lg">ইমেইল</h3>
               <p className="text-gray-400">contact@khoborshunbi.com</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0B0F19] p-4 rounded-xl border border-gray-800">
             <div className="w-12 h-12 bg-[#FF0033]/20 text-[#FF0033] rounded-full flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(255,0,51,0.2)]">📱</div>
             <div>
               <h3 className="text-white font-bold text-lg">ফোন / WhatsApp</h3>
               <p className="text-gray-400">+880 1XXX-XXXXXX <span className="text-xs ml-2 bg-gray-800 px-2 py-1 rounded">(আপনার নম্বর দিন)</span></p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0B0F19] p-4 rounded-xl border border-gray-800">
             <div className="w-12 h-12 bg-[#FF0033]/20 text-[#FF0033] rounded-full flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(255,0,51,0.2)]">📍</div>
             <div>
               <h3 className="text-white font-bold text-lg">ঠিকানা</h3>
               <p className="text-gray-400">ঢাকা, বাংলাদেশ</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}