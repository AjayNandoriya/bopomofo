# 🐉 Bopomofo App (注音符號學習平台)

A modern, interactive web application designed to help learners master Taiwanese Mandarin, Zhuyin Fuhao (Bopomofo / 注音符號), and Chinese character pronunciation.

![Bopomofo Mascot](/public/mascot.jpg)

---

## 🌟 Key Features

### 1. 🈳 Translation & Phonetic Annotator (`/`)
- **Dual Phonetic Modes**: View Chinese characters annotated with either **Zhuyin (注音)** or **Hanyu Pinyin (拼音)** ruby text above characters.
- **Simplified to Traditional Conversion**: Automatically handles character normalization using `opencc-js`.
- **Side-by-Side Dual Pane**: Resizable split-pane editor comparing original input with ruby-annotated text.
- **Interactive Speech Synthesis**: Click any word or sentence to listen to accurate native Mandarin pronunciation.
- **One-Click Copy**: Copy annotated text or raw conversions directly to your clipboard.

### 2. 📖 Stories (`/stories`)
- Curated reading material with ruby-annotated Zhuyin and Pinyin.
- Sentence-by-sentence audio narration and playback controls.
- Adjustable text sizes for comfortable reading.

### 3. 🎵 Songs (`/songs`)
- Traditional and popular nursery rhymes and songs.
- Synchronized lyrics with Zhuyin annotations to make language acquisition fun and musical.

### 4. ⌨️ Zhuyin Typing Practice (`/typing`)
- Interactive Taiwanese standard Bopomofo keyboard layout (ㄅ, ㄆ, ㄇ, ㄈ...).
- Support for physical keyboard typing as well as touch/click input on mobile and desktop.
- Comprehensive coverage of initials, medials, finals, and the 5 Mandarin tones (˙, ˊ, ˇ, ˋ).
- Real-time accuracy validation and prompt feedback.

### 5. 🎯 Word Quiz (`/quiz`)
- Vocabulary flashcards and quizzes powered by the official **TOCFL** (Test of Chinese as a Foreign Language) word list.
- Multiple difficulty levels (Novice, Level 1, Level 2, and beyond).
- Tests character recognition, tone discrimination, and phonetic spelling.

### 6. 🔠 Accessibility & Font Scaling
- Global font size and ruby size controls accessible from anywhere in the top navigation bar.
- Mobile-optimized responsive design with support for touch gestures and viewport adjustments.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language Libraries**:
  - `bopomofo` & `pinyin-pro` for phonetic conversions
  - `opencc-js` for Simplified ↔ Traditional Chinese translation
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/AjayNandoriya/bopomofo.git

# Enter the project directory
cd bopomofo

# Install dependencies
npm install
```

### Development Server
Run the local development server with hot module replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Tests
Execute unit and component test suites:
```bash
npm test -- --run
```

### Building for Production
Build the optimized static assets into the `dist/` directory:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🎨 Mascot & Branding

The app features an adorable baby dragon mascot wearing headphones surrounded by glowing Zhuyin blocks (ㄅ, ㄆ, ㄇ, ㄈ), symbolizing joyful listening, clear pronunciation, and playful language discovery. The mascot asset is located at `public/mascot.jpg`.

---

## 📄 License

Private project / All rights reserved.
