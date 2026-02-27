import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
import json
import os
import hashlib
from datetime import datetime
import urllib.parse
import re

def fetch_multi_source_news():
    print("🌐 মাল্টিপল সোর্স থেকে লাইভ খবর, ছবি এবং বিস্তারিত টেক্সট আনা হচ্ছে...")
    print("একাধিক সাইটের ভেতরে প্রবেশ করার কারণে কিছুটা সময় লাগতে পারে, অপেক্ষা করুন...\n")
    
    rss_feeds = [
        {"name": "BBC বাংলা", "url": "https://feeds.bbci.co.uk/bengali/rss.xml", "category": "আন্তর্জাতিক"},
        {"name": "Google News BD", "url": "https://news.google.com/rss?hl=bn&gl=BD&ceid=BD:bn", "category": "জাতীয়"},
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    public_folder = "public"
    output_path = os.path.join(public_folder, "live_news.json")
    
    existing_news = []
    if os.path.exists(output_path):
        try:
            with open(output_path, "r", encoding="utf-8") as f:
                existing_news = json.load(f)
        except:
            pass

    existing_urls = {news['url'] for news in existing_news if 'url' in news}
    existing_titles = {news['title'].strip() for news in existing_news if 'title' in news}
    new_news_list = []

    for feed in rss_feeds:
        print(f"খবর খোঁজা হচ্ছে: {feed['name']} থেকে...")
        try:
            response = requests.get(feed['url'], headers=headers, timeout=10)
            root = ET.fromstring(response.content)
            
            count = 0
            for item in root.findall('.//item'):
                if count >= 10: 
                    break
                    
                link = item.find('link').text if item.find('link') is not None else ""
                title = item.find('title').text if item.find('title') is not None else "শিরোনাম পাওয়া যায়নি"
                clean_title = title.strip()
                
                if link in existing_urls or clean_title in existing_titles or not link:
                    continue

                pub_date = item.find('pubDate').text if item.find('pubDate') is not None else datetime.now().strftime("%a, %d %b %Y %H:%M:%S GMT")
                unique_id = hashlib.md5(link.encode()).hexdigest()[:10]
                
                rss_desc = ""
                desc_elem = item.find('description')
                if desc_elem is not None and desc_elem.text:
                    rss_desc = BeautifulSoup(desc_elem.text, 'html.parser').get_text(strip=True)

                image_url = ""
                article_details = rss_desc 

                # --- গুগলের রিডাইরেক্ট লিংক বাইপাস করে আসল খবর আনা ---
                actual_link = link
                if link:
                    try:
                        # গুগলের লিংক হলে আসল লিংক বের করার চেষ্টা
                        if "news.google.com" in link:
                            temp_res = requests.get(link, headers=headers, timeout=5)
                            soup_temp = BeautifulSoup(temp_res.text, 'html.parser')
                            a_tag = soup_temp.find('a')
                            if a_tag and a_tag.has_attr('href'):
                                actual_link = a_tag['href']

                        # এবার আসল লিংকে ঢুকে বিস্তারিত খবর ও ছবি আনা
                        if actual_link and actual_link.startswith('http'):
                            article_res = requests.get(actual_link, headers=headers, timeout=8)
                            soup = BeautifulSoup(article_res.text, 'html.parser')
                            
                            # ছবি খোঁজা
                            og_img = soup.find('meta', property='og:image')
                            if og_img:
                                image_url = og_img['content']
                                
                            # বিস্তারিত খবর খোঁজা (আগে ৪ প্যারা ছিল, এখন ১৫ প্যারাগ্রাফ পর্যন্ত আনবে!)
                            paragraphs = soup.find_all('p')
                            extracted_text = "\n\n".join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40][:15])
                            
                            if extracted_text:
                                article_details = extracted_text
                    except Exception as e:
                        pass
                
                # --- এআই দিয়ে ১০০% গ্যারান্টিড ছবি জেনারেট (বাংলা বাদ দিয়ে ইংরেজি প্রম্পট) ---
                if not image_url or "favicon" in image_url:
                    safe_prompt = urllib.parse.quote(f"High quality professional breaking news photography journalism event Bangladesh id {unique_id}")
                    image_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=800&height=500&nologo=true"
                
                if not article_details or len(article_details) < 30:
                    article_details = "বিস্তারিত সংবাদ এই মুহূর্তে লোড করা সম্ভব হয়নি। মূল লিংকে ভিজিট করুন অথবা অডিওটি শুনুন।"
                
                new_news_list.append({
                    "id": unique_id,
                    "url": link,
                    "title": title,
                    "category": feed['name'],
                    "time": pub_date[:16],
                    "image": image_url,
                    "details": article_details 
                })
                
                existing_urls.add(link)
                existing_titles.add(clean_title)
                
                count += 1
                
            print(f"✅ {count} টি নতুন খবর যুক্ত হয়েছে ({feed['name']})।")
        except Exception as e:
            print(f"❌ এরর: {e}")

    final_news_list = new_news_list + existing_news
    final_news_list = final_news_list[:150]

    if not os.path.exists(public_folder):
        os.makedirs(public_folder)
        
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_news_list, f, ensure_ascii=False, indent=4)
        
    print(f"\n🎉 ম্যাজিক সফল! এখন মোট {len(final_news_list)} টি খবর ওয়েবসাইটে আছে।")

if __name__ == "__main__":
    fetch_multi_source_news()