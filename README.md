# 🚀 Growtix

> **A Next-Generation, AI-Powered SaaS Platform for Developers.**

Growtix is a gamified EdTech platform designed to help developers sharpen their coding skills, build daily discipline, and accelerate learning through AI mentorship. Built on a modern React stack with a secure Supabase backend, Growtix blends competitive-programming mechanics with cutting-edge AI-driven feedback.

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## ✨ Key Features

- 🤖 **AI-Powered Practice Lab** — Dynamically generated daily coding challenges powered by the Groq API (Llama 3.3 70B). Includes progressive hints, optimal time/space complexity targets, and AI-driven code reviews.
- 💻 **Real-Time Code Execution** — Integrated with the **Piston API** to securely compile and run user code in multiple languages (C++, Python, JavaScript, Java, C) against hidden test cases via standard I/O.
- 🔥 **Gamified Dashboard** — Real-time sync of Total XP, Global Rank, and Daily Streaks.
- 🔒 **Secure Progress Tracking** — Uses Supabase RPCs to calculate and update XP/streaks server-side, preventing client-side manipulation, with `localStorage` caching for instant UI rendering.
- 📅 **Interactive Productivity Suite** — A LeetCode-style interactive calendar and daily to-do list that auto-tracks completed challenges.
- 🎨 **Premium UI/UX** — Built with Tailwind CSS, Framer Motion, and Radix UI primitives, featuring a glassmorphism aesthetic and a fully resizable workspace via `react-resizable-panels`.

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom components |
| Animation | Framer Motion |
| Code Editor | `@monaco-editor/react` (VS Code engine) |
| UI Components | Radix UI / shadcn/ui |

### Backend & Database
| Layer | Technology |
|---|---|
| BaaS | Supabase |
| Auth | Supabase Auth |
| Database | PostgreSQL (custom RPCs for secure gamification logic) |

### External APIs
| Purpose | Service |
|---|---|
| Code Execution | Piston API |
| AI Engine | Groq API (Llama-3.3-70B) / Google Gemini API |

---

## 🏗️ Architecture & Security Highlights

**Hybrid State Management**
Growtix uses a hybrid data-fetching strategy for performance and security:
1. **Local Storage Caching** — Dashboard stats (XP, streaks, tasks) load instantly from cache to avoid UI flicker.
2. **Supabase Background Sync** — Real-time data syncs in the background for accuracy across devices.

**Server-Side Gamification** (`increment_user_progress`)
All XP and streak calculations run through a `SECURITY DEFINER` PostgreSQL function on the Supabase server, preventing client-side tampering.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) or npm/yarn
- A [Supabase](https://supabase.com/) project
- A [Groq API](https://console.groq.com/) key

### 1. Clone the repository
```bash
git clone https://github.com/pushpender1043/growtix.git
cd growtix
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Environment variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Supabase database setup
Run in your Supabase SQL Editor:
```sql
-- Setup profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_solved_date DATE,
  ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;

-- Create gamification RPC
CREATE OR REPLACE FUNCTION increment_user_progress(uid UUID, points_to_add INT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_streak INT;
  last_date DATE;
  today DATE;
  new_streak INT;
  new_xp INT;
BEGIN
  today := current_date;

  SELECT coalesce(streak, 0), last_solved_date, coalesce(xp, 0)
  INTO current_streak, last_date, new_xp
  FROM profiles WHERE id = uid;

  IF last_date = today THEN
    RETURN json_build_object('status', 'already_solved', 'streak', current_streak, 'xp', new_xp);
  END IF;

  IF last_date = today - INTERVAL '1 day' THEN
    new_streak := current_streak + 1;
  ELSE
    new_streak := 1;
  END IF;

  new_xp := new_xp + points_to_add;

  UPDATE profiles SET streak = new_streak, last_solved_date = today, xp = new_xp WHERE id = uid;

  RETURN json_build_object('status', 'success', 'streak', new_streak, 'xp', new_xp);
END;
$$;
```

### 5. Start the development server
```bash
npm run dev
# or
bun run dev
```

---



## 👥 Contributors

A huge thanks to the amazing people who built Growtix 🚀

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/pushpender1043">
        <img src="https://github.com/pushpender1043.png" width="100px;" alt="Pushpender Mishra"/>
        <br />
        <sub><b>Pushpender Mishra</b></sub>
      </a>
      <br />
      <a href="https://github.com/pushpender1043">@pushpender1043</a>
    </td>
    <td align="center">
      <a href="https://github.com/millyjain09">
        <img src="https://github.com/millyjain09.png" width="100px;" alt="Milly Jain"/>
        <br />
        <sub><b>Milly Jain</b></sub>
      </a>
      <br />
      <a href="https://github.com/millyjain09">@millyjain09</a>
    </td>
    <td align="center">
      <a href="https://github.com/Lovepreet-Kaur-Gill">
        <img src="https://github.com/Lovepreet-Kaur-Gill.png" width="100px;" alt="Lovepreet Kaur"/>
        <br />
        <sub><b>Lovepreet Kaur</b></sub>
      </a>
      <br />
      <a href="https://github.com/Lovepreet-Kaur-Gill">@Lovepreet-Kaur-Gill</a>
    </td>
    <td align="center">
      <a href="https://github.com/sahilsingh682">
        <img src="https://github.com/sahilsingh682.png" width="100px;" alt="Sahil Singh"/>
        <br />
        <sub><b>Sahil Singh</b></sub>
      </a>
      <br />
      <a href="https://github.com/sahilsingh682">@sahilsingh682</a>
    </td>
  </tr>
</table>

<div align="center">
  <sub>Want to be a part of this list? Check out the <a href="#-contributing">Contributing</a> guide and open a PR!</sub>
</div>

---

## 🤝 Contributing

This is a collaborative project — please follow this workflow:

1. **Create a feature branch:** `git checkout -b feature/your-feature-name`
2. **Commit your changes:** `git commit -m 'Add some feature'`
3. **Push to the branch:** `git push origin feature/your-feature-name`
4. **Open a Pull Request** for review

Please ensure new UI components use the existing Tailwind configuration and follow the project's glassmorphism design language.

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
