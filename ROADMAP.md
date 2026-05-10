# 🐙 The Catoolu — Development Roadmap

> *"That is not dead which can eternal lie, and with strange aeons even death may die."*
> — H.P. Lovecraft

A self-hosted Call of Cthulhu 7e character manager on its way to becoming a full lightweight VTT.
Built by **Someone at Saltlakes** with **Claude** (Anthropic).

---

## Version Naming Convention

Each version is named after a Great Old One from the Cthulhu Mythos.
As the platform grows, so do the horrors it contains.

| Version | Codename | Entity | Meaning |
|---|---|---|---|
| v1.0 | *Azathoth* | The Blind Idiot God | The chaotic origin — the first thing that existed |
| v1.5 | *Nyarlathotep* | The Crawling Chaos | The messenger — the one who connects things |
| v2.0 | *Shub-Niggurath* | The Black Goat | Fertile and multiplying — many branches |
| v2.5 | *Yog-Sothoth* | The Key and the Gate | Omniscient — sees all times and places |
| v3.0 | *Cthulhu* | The Great Dreamer | The final form — the one it was all named for |

---

## ✅ v1.0 — Azathoth
**Status: Released — May 2026**
**"In the beginning there was chaos, and the chaos had character sheets."**

The foundation. Built from zero web development experience to a fully containerised, self-hosted production application.

### Features
- [x] User registration and login with JWT authentication
- [x] Password hashing with bcrypt
- [x] Forgot password flow with email reset links (Resend)
- [x] User profile page — change username, email, password
- [x] Investigator dashboard with portrait cards (SAN + HP display)
- [x] Dhole's House `.json` import and export
- [x] Full CoC 7e character editor
- [x] Live CoC 7e rule calculations (HP, MP, Sanity, Damage Bonus, Build, Dodge, Move)
- [x] Separate current tracking for HP, MP, Sanity, and Luck
- [x] Characteristics displayed with Reg / Half / Fifth values
- [x] Grouped skill display (Dhole's House style)
- [x] Skill search filter
- [x] Editable subskill names
- [x] Official CoC 7e weapon preset picker
- [x] Add / delete weapons and possessions
- [x] Session notes with rich text editor (bold, italic, lists, custom colours)
- [x] Saveable colour swatches for notes
- [x] Dark theme and Parchment theme toggle
- [x] Skill text size toggle (Small / Medium / Large)
- [x] Dynamic portrait aspect ratio
- [x] Click-to-open character cards
- [x] Docker + Docker Compose containerisation
- [x] Nginx reverse proxy with HTTPS
- [x] Self-hosted on ZimaOS via DuckDNS

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL 16 (JSONB character storage)
- **Auth:** JWT, bcryptjs
- **Email:** Nodemailer + Resend
- **Deployment:** Docker, Nginx, ZimaOS, DuckDNS

---

## 🔜 v1.5 — Nyarlathotep
**Status: Planned — Target Q3 2026**
**"The Messenger arrives. The investigators can finally talk to each other."**

The social layer. The Catoolu becomes a shared space.

### Planned Features
- [ ] **Campaigns** — Keepers create campaigns and invite players by username
- [ ] **Campaign dashboard** — view all member investigators in one place
- [ ] **Keeper read-only view** — Keeper can see all player sheets
- [ ] **Real-time chatroom** — per-campaign chat using WebSockets (Socket.io)
- [ ] **Persistent chat history** — scroll back through session logs
- [ ] **System messages** — *"Kurt Weber has joined the investigation"*
- [ ] **Dice roller** — `/roll 1d100`, `/roll 2d6+3` in chat
- [ ] **Skill rolls** — `/roll Firearms` rolls against the investigator's skill and shows CoC success level
- [ ] **Public dice results** — all players see every roll in chat

### New Tech
- Socket.io (WebSockets for real-time communication)
- Campaign data model (many-to-many: users ↔ campaigns)

---

## 🔮 v2.0 — Shub-Niggurath
**Status: Planned — Target Q4 2026**
**"A thousand young. The platform branches and multiplies."**

The Keeper's tools. Genuinely useful at the table.

### Planned Features
- [ ] **Keeper's Screen** — live view of all investigator HP, Sanity, Luck
- [ ] **Push sanity loss** — Keeper inputs loss, player's sheet updates live
- [ ] **Push damage** — same mechanic for Hit Points
- [ ] **Handouts** — Keeper uploads images and shares to campaign
- [ ] **Handout gallery** — per-campaign image library
- [ ] **NPC / Monster stat blocks** — Keeper-only quick reference
- [ ] **Initiative tracker** — drag-to-reorder turn list, visible to all

### New Tech
- File/image upload handling
- Real-time multi-user state synchronisation

---

## 🔮 v2.5 — Yog-Sothoth
**Status: Planned — Target Q1 2027**
**"The Gate. It knows. It sees. Your investigators' history is preserved."**

The memory layer. The Catoolu remembers everything.

### Planned Features
- [ ] **Session journal** — post-session summaries attached to campaigns
- [ ] **Investigator change log** — *"Sanity dropped from 55 to 49 — Session 4"*
- [ ] **Death records** — with cause of death (obviously)
- [ ] **Campaign timeline** — visual session history with events and NPCs
- [ ] **Clue board** — Keeper-managed investigation board with linked clue cards
- [ ] **Lore entries** — locations, tomes, and contacts per campaign

### New Tech
- Timeline UI components
- Graph/connection data model for clue linking

---

## 🔮 v3.0 — Cthulhu
**Status: Planned — Target Q2 2027**
**"Ph'nglui mglw'nafh. The Great Dreamer wakes. The platform is complete."**

The full vision. The Catoolu as a proper lightweight CoC VTT.

### Planned Features
- [ ] **Multiple campaigns** — archive, templates, shareable invite links
- [ ] **Audio ambience** — Keeper streams ambient sound to all players (Rain, Ritual, Combat etc.)
- [ ] **Character advancement** — post-session XP, skill improvement rolls, Keeper approval
- [ ] **Full advancement audit trail** — how every investigator grew over a campaign
- [ ] **Mobile-optimised UI** — full responsive redesign for phone play at the table
- [ ] **PWA support** — installable on phone home screen
- [ ] **Push notifications** — *"The Keeper is ready to start"*
- [ ] **Offline sheet viewing** — service worker caching

### New Tech
- Web Audio API
- PWA manifest + service workers
- Mobile-first responsive redesign

---

## Release Timeline

```
2026
 May  ████████████████  v1.0 Azathoth     ✅ Released
 Jul  ░░░░░░░░░░░░░░░░  v1.5 Nyarlathotep  🔜 Planned
 Sep  ░░░░░░░░░░░░░░░░  v2.0 Shub-Niggurath 🔮 Planned

2027
 Jan  ░░░░░░░░░░░░░░░░  v2.5 Yog-Sothoth   🔮 Planned
 May  ░░░░░░░░░░░░░░░░  v3.0 Cthulhu       🔮 Planned
```

---

## Contributing

This is a personal project built for a CoC group of approximately 3 investigators.
Feature requests from the players are accepted. Feature requests from the Ancient Ones are not.

---

*Ia! Ia! The Catoolu fhtagn!* 🐙
