# AhorrApp 💰

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

AhorrApp is a personal finance application built with React Native and Expo, designed to help users manage their savings and expenses efficiently. The app features a clean, intuitive interface and leverages modern technologies for a robust and scalable solution.

## 📖 Table of Contents

- [📦 Technologies Used](#-technologies-used)
- [🧠 Architecture](#-architecture)
- [🛠️ Current Project Status](#️-current-project-status)
- [📈 Roadmap](#-roadmap)
- [📊 Diagrams](#-diagrams)
  - [Folder Structure](#folder-structure)
  - [Authentication Flow](#authentication-flow)
  - [AI Receipt Scanning Flow (Upcoming)](#ai-receipt-scanning-flow-upcoming)
- [👨‍💻 How to Contribute](#-how-to-contribute)
- [🚀 Deployment](#-deployment)
- [📜 License](#-license)
- [📧 Contact](#-contact)

---

## 📦 Technologies Used

This project is built with a modern and powerful tech stack:

- **React Native (with Expo):** For cross-platform mobile app development.
- **Firebase:**
  - **Authentication:** For user sign-up, sign-in, and session management.
  - **Firestore:** As the primary database for storing user data.
- **Cloudinary:** For cloud-based image storage and management (e.g., user profile pictures).
- **TypeScript:** For a strongly-typed codebase, ensuring code quality and maintainability.
- **ESLint:** To enforce strict coding standards and identify potential issues early.
- **Prettier:** For automated code formatting, maintaining a consistent style across the project.
- **Phosphor React Native Icons:** For a rich set of high-quality icons.
- **Moti:** For creating smooth and performant animations.

---

## 🧠 Architecture

The project follows a modular and scalable architecture, organized into distinct folders for clarity and separation of concerns:

- **`app/`:** Contains all the screens and navigation logic, following the Expo Router structure.
  - `(auth)/`: Screens related to authentication (Login, Register).
  - `(tabs)/`: Main screens of the application after login (Home, Profile, etc.).
  - `(modals)/`: Modals that can be displayed over other screens.
- **`components/`:** Reusable UI components (`Input`, `Button`, `ModalWrapper`, etc.).
- **`services/`:** Modules for interacting with external services like Firebase and Cloudinary.
- **`contexts/`:** React Context providers, such as the `AuthContext` for managing authentication state globally.
- **`hooks/`:** Custom hooks to encapsulate and reuse stateful logic.
- **`types/`:** TypeScript type definitions and interfaces.
- **`constants/`:** Global constants like theme colors, API keys, etc.
- **`utils/`:** Utility functions used across the application.

This structure, combined with **TypeScript's strong typing**, ensures that the codebase is clean, maintainable, and easy to scale.

---

## 🛠️ Current Project Status

- [✅] **User Authentication:** Fully implemented sign-up and sign-in flow.
- [✅] **Basic Profile:** Users can view their name, email, and update their profile picture.
- [✅] **Image Uploads:** Profile picture uploads are handled by Cloudinary.
- [✅] **Organized Codebase:** The project structure is well-defined and follows best practices.
- [✅] **Linting and Formatting:** ESLint and Prettier are configured to ensure code quality.
- [✅] **Conventional Commits:** All contributions follow the conventional commit standard (`feat:`, `fix:`, `refactor:`, etc.).

---

## 📈 Roadmap

Here are the features and improvements planned for the future:

- [ ] **Complete Profile Screen:** Add more user details and settings.
- [ ] **Statistics Screen:** Develop a dashboard for financial insights and visualizations.
- [ ] **Wallet Screen:** Implement functionality to track expenses and savings.
- [ ] **Improve Home Screen:** Enhance the main dashboard for a better user experience.
- [ ] **Password Recovery:** Add a "Forgot Password" feature.
- [ ] **AI-Powered Receipt Scanning:** Integrate an AI model to scan receipts, extract data, and categorize expenses automatically.
- [ ] **Play Store Integration:** Prepare and deploy the application to the Google Play Store.
- [ ] **Multi-Currency Support:** Allow users to manage finances in different currencies.
- [ ] **Custom Financial Goals:** Enable users to set and track personal savings goals.

---

## 📊 Diagrams

### Folder Structure

```
.
├── app/
│   ├── (auth)/
│   ├── (modals)/
│   └── (tabs)/
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── shared/
│   └── ui/
├── config/
├── constants/
├── contexts/
├── hooks/
├── scripts/
├── service/
├── types/
└── utils/
```

### Authentication Flow

```
User opens the app
      │
      v
Is user authenticated?
      ├─ Yes ──> Show Main App (Tabs)
      └─ No  ──> Show Welcome Screen
                   │
                   ├─> Login ──> Success? ──> Main App
                   │     │
                   │     └─ Fail? ──> Show error
                   │
                   └─> Register ──> Success? ──> Main App
                         │
                         └─ Fail? ──> Show error
```

### AI Receipt Scanning Flow (Upcoming)

A diagram detailing the flow of the AI-powered receipt scanning feature will be added here once development begins.

---

## 👨‍💻 How to Contribute

We welcome contributions! To ensure a smooth collaboration, please follow these guidelines:

1.  **Format Your Code:** All code must be formatted with **Prettier** before committing.
2.  **Follow Linting Rules:** Ensure your code adheres to the **ESLint** rules configured in the project.
3.  **Use Conventional Commits:** Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (e.g., `feat: add new feature`, `fix: resolve a bug`).
4.  **Write Typed Code:** All new code should be written in **TypeScript** with proper type definitions.
5.  **Document Components:** Clearly document any new reusable components you create.

---

## 🚀 Deployment

The application is planned for deployment on the **Google Play Store**.

---

## 📜 License

AhorrApp License v1.0

Copyright (c) 2025 Felipe Reyes Sanchez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to use,
copy, modify, merge, publish, distribute, and/or sublicense copies of the Software,
subject to the following conditions:

1.  **Attribution Required** – You must always retain clear and visible credit to the original author, Felipe Reyes Sanchez:
    - The LICENSE file must not be removed or altered.
    - Any use, distribution or modification of the app/code must include explicit attribution in both the source code and any user-facing interface (if applicable).
    - The in-app credits must remain intact and unaltered.

2.  **No Removal of Credit** – You may not remove or obscure any references to the original author, including but not limited to:
    - README files
    - About/Credits screens
    - Metadata or descriptions in app stores

3.  **Modifications** – You are allowed to modify this software for personal or commercial use, but:
    - You must clearly document any modifications made.
    - You must not claim the original work as your own.

4.  **Redistribution** – You may distribute modified or unmodified versions of the Software under the same license and attribution terms.

5.  **Warranty Disclaimer** – The software is provided “as is”, without warranty of any kind.

By using, modifying, or distributing this software, you agree to be bound by the terms of this license.

---

## 📧 Contact

**Author:** Felipe Reyes Sanchez
**Contact:** jfelipe9.121@gmail.com
**Project:** AhorrApp – App de Finanzas Personales
