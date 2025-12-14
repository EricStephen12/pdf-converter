'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';

const hashtagDatabase: Record<string, string[]> = {
  photography: ['#photography', '#photooftheday', '#photo', '#photographer', '#naturephotography', '#photographylovers', '#travelphotography', '#streetphotography', '#portraitphotography', '#landscapephotography', '#photoshoot', '#canon', '#nikon', '#sony', '#35mm'],
  travel: ['#travel', '#travelgram', '#traveling', '#travelphotography', '#instatravel', '#travelblogger', '#wanderlust', '#adventure', '#explore', '#vacation', '#trip', '#holiday', '#tourism', '#traveltheworld', '#backpacking'],
  food: ['#food', '#foodie', '#foodporn', '#instafood', '#foodphotography', '#yummy', '#delicious', '#foodstagram', '#foodblogger', '#homemade', '#cooking', '#recipe', '#healthyfood', '#dinner', '#lunch'],
  fitness: ['#fitness', '#gym', '#workout', '#fitnessmotivation', '#fit', '#training', '#health', '#bodybuilding', '#motivation', '#exercise', '#healthy', '#lifestyle', '#muscle', '#fitfam', '#crossfit'],
  fashion: ['#fashion', '#style', '#ootd', '#fashionblogger', '#fashionista', '#streetstyle', '#outfit', '#fashionstyle', '#instafashion', '#stylish', '#trendy', '#fashionable', '#lookoftheday', '#whatiwore', '#styleinspo'],
  beauty: ['#beauty', '#makeup', '#skincare', '#beautiful', '#cosmetics', '#makeupartist', '#beautyblogger', '#mua', '#lipstick', '#eyeshadow', '#beautytips', '#skincareroutine', '#glam', '#makeuplover', '#beautyguru'],
  business: ['#business', '#entrepreneur', '#success', '#motivation', '#marketing', '#startup', '#money', '#businessowner', '#entrepreneurship', '#smallbusiness', '#hustle', '#goals', '#leadership', '#mindset', '#growth'],
  art: ['#art', '#artist', '#artwork', '#drawing', '#painting', '#illustration', '#artistsoninstagram', '#sketch', '#creative', '#digitalart', '#design', '#artoftheday', '#contemporaryart', '#instaart', '#artistlife'],
  music: ['#music', '#musician', '#singer', '#song', '#hiphop', '#rap', '#dj', '#producer', '#newmusic', '#spotify', '#soundcloud', '#beats', '#guitar', '#piano', '#livemusic'],
  nature: ['#nature', '#naturephotography', '#landscape', '#wildlife', '#sunset', '#mountains', '#ocean', '#forest', '#flowers', '#sky', '#earth', '#outdoors', '#hiking', '#animals', '#beautiful'],
  tech: ['#tech', '#technology', '#coding', '#programming', '#developer', '#software', '#ai', '#startup', '#innovation', '#digital', '#computer', '#webdev', '#javascript', '#python', '#machinelearning'],
  realestate: ['#realestate', '#realtor', '#home', '#property', '#forsale', '#househunting', '#newhome', '#dreamhome', '#investment', '#luxuryhomes', '#architecture', '#interiordesign', '#homesforsale', '#realestateagent', '#sold'],
};

const categories = Object.keys(hashtagDatabase);

export default function HashtagGenerator() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const generateHashtags = () => {
    let hashtags: string[] = [];
    
    selectedCategories.forEach(cat => {
      hashtags = [...hashtags, ...hashtagDatabase[cat]];
    });

    if (customKeyword.trim()) {
      const keywords = customKeyword.split(',').map(k => k.trim()).filter(Boolean);
      keywords.forEach(keyword => {
        hashtags.push(`#${keyword.replace(/\s+/g, '').toLowerCase()}`);
      });
    }

    // Remove duplicates and shuffle
    const unique = [...new Set(hashtags)];
    const shuffled = unique.sort(() => Math.random() - 0.5).slice(0, 30);
    setGeneratedHashtags(shuffled);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Hashtag Generator"
      description="Generate trending hashtags for Instagram, TikTok, Twitter, and more. Boost your social media reach."
      icon="#️⃣"
      color="blue"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Select Categories</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Custom Keywords</label>
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              placeholder="Enter keywords separated by commas..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Example: sunset, beach, summer</p>
          </div>

          <button
            onClick={generateHashtags}
            disabled={selectedCategories.length === 0 && !customKeyword.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
          >
            Generate Hashtags
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Generated Hashtags</h3>
            {generatedHashtags.length > 0 && (
              <span className="text-gray-400 text-sm">{generatedHashtags.length} hashtags</span>
            )}
          </div>

          {generatedHashtags.length > 0 ? (
            <>
              <div className="bg-white/5 rounded-xl p-4 mb-4 min-h-[200px]">
                <div className="flex flex-wrap gap-2">
                  {generatedHashtags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {copied ? '✓ Copied to Clipboard!' : 'Copy All Hashtags'}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-5xl mb-4">#️⃣</div>
              <p>Select categories and generate hashtags</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
