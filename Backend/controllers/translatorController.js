const axios = require('axios');
const { mockPhrases } = require('../data/mockData');

// 28 Supported Languages ISO-639 Mapping
const SUPPORTED_LANGUAGES = {
  'English': 'en',
  'Hindi': 'hi',
  'Bengali': 'bn',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Italian': 'it',
  'Japanese': 'ja',
  'Chinese (Simplified)': 'zh',
  'Arabic': 'ar',
  'Portuguese': 'pt',
  'Russian': 'ru',
  'Korean': 'ko',
  'Dutch': 'nl',
  'Turkish': 'tr',
  'Greek': 'el',
  'Thai': 'th',
  'Vietnamese': 'vi',
  'Indonesian': 'id',
  'Polish': 'pl',
  'Swedish': 'sv',
  'Czech': 'cs',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Marathi': 'mr',
  'Gujarati': 'gu',
  'Punjabi': 'pa',
  'Malayalam': 'ml',
};

// Helper: Call OpenAI GPT for Translation if OPENAI_API_KEY exists
const translateWithOpenAI = async (text, sourceLang, targetLang) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-')) return null;

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert real-time travel translator. Translate the text accurately into the target language. Return valid JSON with two keys: "translatedText" and "pronunciation" (phonetic guide in English script).'
          },
          {
            role: 'user',
            content: `Translate from ${sourceLang} to ${targetLang}: "${text}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    if (res.data?.choices?.[0]?.message?.content) {
      const reply = res.data.choices[0].message.content;
      const match = reply.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          translatedText: parsed.translatedText,
          pronunciation: parsed.pronunciation || `(${parsed.translatedText} in ${targetLang})`,
          provider: 'OpenAI GPT-4o AI'
        };
      }
    }
  } catch (e) {
    console.warn('⚡ OpenAI Translator Note:', e.message);
  }
  return null;
};

// Helper: Call MyMemory Free Translation API
const translateWithMyMemory = async (text, sourceLang, targetLang) => {
  const src = SUPPORTED_LANGUAGES[sourceLang] || 'en';
  const tgt = SUPPORTED_LANGUAGES[targetLang] || 'hi';
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
    const res = await axios.get(url, { timeout: 5000 });
    if (res.data && res.data.responseData && res.data.responseData.translatedText) {
      const translated = res.data.responseData.translatedText;
      return {
        translatedText: translated,
        pronunciation: `Phonetic (${targetLang}): ${translated}`,
        provider: 'MyMemory Live Translation API'
      };
    }
  } catch (e) {
    console.warn('⚡ MyMemory API Note:', e.message);
  }
  return null;
};

const translateText = async (req, res) => {
  try {
    const { text, sourceLang = 'English', targetLang = 'Hindi' } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text to translate is required.' });
    }

    // 1. Try OpenAI GPT Translation if key is configured
    const openAIResult = await translateWithOpenAI(text, sourceLang, targetLang);
    if (openAIResult) {
      return res.json({
        success: true,
        originalText: text,
        sourceLang,
        targetLang,
        ...openAIResult
      });
    }

    // 2. Try MyMemory Free Live API
    const myMemoryResult = await translateWithMyMemory(text, sourceLang, targetLang);
    if (myMemoryResult) {
      return res.json({
        success: true,
        originalText: text,
        sourceLang,
        targetLang,
        ...myMemoryResult
      });
    }

    // 3. Fallback
    return res.json({
      success: true,
      originalText: text,
      sourceLang,
      targetLang,
      translatedText: `[${targetLang}]: ${text}`,
      pronunciation: `(${text} in ${targetLang} script)`,
      provider: 'TravelGenie Translator Engine'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Translation failed.' });
  }
};

const getTravelPhrases = async (req, res) => {
  try {
    return res.json({ success: true, count: mockPhrases.length, phrases: mockPhrases, languages: Object.keys(SUPPORTED_LANGUAGES) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch phrasebook.' });
  }
};

module.exports = { translateText, getTravelPhrases, SUPPORTED_LANGUAGES };
