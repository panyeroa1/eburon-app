<div align="center">
  <img src="ollama-nextjs-ui.gif">
</div>

<h1 align="center">
  PetMatch – AI-powered Animal Adoption Platform
</h1>

<div align="center">
  <strong>Built with Next.js, TailwindCSS, Ollama, and AWS S3</strong>
  <br />
  Easily connect people looking to adopt pets with those offering animals for adoption.
</div>

---

# 🚀 Features

- 🤖 **Ollama Chat Assistant** – Helps match pets with adopters based on user input.
- 🐾 **Offer a Pet Page** – Users can submit a pet's name, size, personality, type, and photo.
- 🖼️ **Image Upload to S3** – Pet images are uploaded and served from `m-adoption-images` S3 bucket.
- 🧠 **LLM Matching** – Matches adopters to pets using the `llama3.2:1b` model from Ollama.
- 💾 **Fully local** – No database needed; works offline after setup.
- 📱 **Responsive UI** – Works on mobile, tablet, and desktop.
- 🌗 **Light & Dark Mode** – Optional light/dark mode toggle.
- 🔄 **Persistent chat history** – Stored in localStorage.

---

# 📸 Preview

![Preview](https://github.com/MaisaSh99/m-nextjs-ollama-llm-ui/assets/preview.gif)

---

# ⚙️ Requirements

- [Ollama](https://ollama.com/download) installed and running.
- Node.js v18+ and npm.
- AWS S3 bucket named `m-adoption-images` (configured in `.env`).

---

# 🧑‍💻 Local Installation

```bash
git clone https://github.com/MaisaSh99/m-nextjs-ollama-llm-ui.git
cd m-nextjs-ollama-llm-ui
mv .example.env .env
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using PetMatch.

---

# 📦 Tech Stack

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Ollama](https://ollama.com/) for LLM processing
- [AWS S3](https://aws.amazon.com/s3/) for pet image hosting

---

# 📬 Contact

Built by [@MaisaSh99](https://github.com/MaisaSh99) for the Fursa AI Mid-Project.

Contributions welcome!
