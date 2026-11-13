# Learners-help

Kerala Motor Vehicles Department (MVD) Learner's Licence Mock Test & Practice Platform (സാരഥി പരീക്ഷാ മാതൃക).

## 🚀 Features
- **Official Sarathi Exam Simulation:** 30 randomly selected questions, 30 seconds per question, 18 marks to pass (60%).
- **Comprehensive Question Bank:** 942 verified Malayalam questions covering Road Signs, Traffic Rules, Fines & Penalties, Road Safety, and Licensing.
- **Traffic Signs & Visuals:** 310 cleaned WebP traffic sign illustrations and option images.
- **Interactive Study Mode:** Topic-wise learning with LocalStorage progress tracking (Mastered, Learning, Mistakes revision).
- **Offline Audio Effects:** Warning tick at 5s, submit chime, and pass/fail audio using Web Audio API.

## 📁 Repository Structure
- `sarathi-test-app/` – Vite + React + Tailwind CSS web application
- `questions.json` – Master dataset of 942 questions (Malayalam UTF-8)
- `images/` – 310 WebP traffic signs and option pictures
- `learners_question_bank_corrected.zip` – Packaged question bank archive

## 💻 Running Locally
```bash
cd sarathi-test-app
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.
