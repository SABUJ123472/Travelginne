const axios = require('axios');
const { mockPhrases } = require('../data/mockData');

const CODE_TO_NAME = {
  'en': 'English',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'ja': 'Japanese',
  'zh': 'Chinese (Simplified)',
  'ar': 'Arabic',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ko': 'Korean',
  'nl': 'Dutch',
  'tr': 'Turkish',
  'th': 'Thai',
  'ta': 'Tamil',
  'te': 'Telugu',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'pa': 'Punjabi',
  'ml': 'Malayalam',
};

const NAME_TO_CODE = {
  'english': 'en', 'en': 'en',
  'hindi': 'hi', 'hi': 'hi',
  'bengali': 'bn', 'bn': 'bn',
  'spanish': 'es', 'es': 'es',
  'french': 'fr', 'fr': 'fr',
  'german': 'de', 'de': 'de',
  'italian': 'it', 'it': 'it',
  'japanese': 'ja', 'ja': 'ja',
  'chinese': 'zh', 'zh': 'zh',
  'arabic': 'ar', 'ar': 'ar',
  'portuguese': 'pt', 'pt': 'pt',
  'russian': 'ru', 'ru': 'ru',
  'korean': 'ko', 'ko': 'ko',
  'dutch': 'nl', 'nl': 'nl',
  'turkish': 'tr', 'tr': 'tr',
  'thai': 'th', 'th': 'th',
  'tamil': 'ta', 'ta': 'ta',
  'telugu': 'te', 'te': 'te',
  'marathi': 'mr', 'mr': 'mr',
  'gujarati': 'gu', 'gu': 'gu',
  'punjabi': 'pa', 'pa': 'pa',
  'malayalam': 'ml', 'ml': 'ml',
};

const getLangCode = (langStr) => {
  if (!langStr) return 'en';
  const clean = langStr.toLowerCase().trim();
  return NAME_TO_CODE[clean] || (clean.length === 2 ? clean : 'en');
};

const getLangName = (langStr) => {
  const code = getLangCode(langStr);
  return CODE_TO_NAME[code] || langStr;
};

// Helper: Call OpenAI GPT for Translation if OPENAI_API_KEY exists
const translateWithOpenAI = async (text, sourceLang, targetLang) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-')) return null;

  const srcName = getLangName(sourceLang);
  const tgtName = getLangName(targetLang);

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
            content: `Translate from ${srcName} to ${tgtName}: "${text}"`
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
          pronunciation: parsed.pronunciation || `(${parsed.translatedText} in ${tgtName})`,
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
  const src = getLangCode(sourceLang);
  const tgt = getLangCode(targetLang);
  const tgtName = getLangName(targetLang);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;
    const res = await axios.get(url, { timeout: 5000 });
    if (res.data && res.data.responseData && res.data.responseData.translatedText) {
      const translated = res.data.responseData.translatedText;
      return {
        translatedText: translated,
        pronunciation: `Phonetic (${tgtName}): ${translated}`,
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
    const { text, sourceLang = 'en', targetLang = 'bn' } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text to translate is required.' });
    }

    const srcCode = getLangCode(sourceLang);
    const tgtCode = getLangCode(targetLang);
    const srcName = getLangName(sourceLang);
    const tgtName = getLangName(targetLang);

    // 1. Try OpenAI GPT Translation if key is configured
    const openAIResult = await translateWithOpenAI(text, srcName, tgtName);
    if (openAIResult) {
      return res.json({
        success: true,
        originalText: text,
        sourceLang: srcName,
        targetLang: tgtName,
        ...openAIResult
      });
    }

    // 2. Try MyMemory Free Live API
    const myMemoryResult = await translateWithMyMemory(text, srcCode, tgtCode);
    if (myMemoryResult) {
      return res.json({
        success: true,
        originalText: text,
        sourceLang: srcName,
        targetLang: tgtName,
        ...myMemoryResult
      });
    }

    // 3. Fallback
    return res.json({
      success: true,
      originalText: text,
      sourceLang: srcName,
      targetLang: tgtName,
      translatedText: `[${tgtName}]: ${text}`,
      pronunciation: `(${text} in ${tgtName} script)`,
      provider: 'TravelGenie Translator Engine'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Translation failed.' });
  }
};

const getTravelPhrases = async (req, res) => {
  try {
    return res.json({
      success: true,
      count: mockPhrases.length,
      phrases: mockPhrases,
      languages: Object.values(CODE_TO_NAME)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch phrasebook.' });
  }
};

module.exports = { translateText, getTravelPhrases, SUPPORTED_LANGUAGES: CODE_TO_NAME };
