# 🌿 BranchTale

BranchTale is an open-source interactive story platform where users can create, share, and read branching narratives.

---

## ✨ Features

- Visual editor for branching stories
- Image and video attachments
- Comments, likes, and bookmarks
- User file upload management with storage limits
- Modern responsive UI (Next.js, Tailwind CSS, shadcn/ui)
- Authentication (NextAuth with Google and credentials)

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/branchtale.git
cd branchtale
npm install
```

Create a .env.local file and add your environment variables:
```bash
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/branchtale
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

Run the development server:
```bash
npm run dev
```

## 🛡️ License
This project is licensed under the GNU AGPL v3.
