# Klysavo AI Banking 🏦✨
> **Precision Cross-Platform AI Banking & Financial Services Mobile Application**
> Built with **React Native**, **Expo SDK 54**, **TypeScript**, **Firebase**, and **Google Cloud Platform (GCP)**.

---

## 📥 Direct Standalone Release APK Download & Testing Credentials

> [!IMPORTANT]
> **Use the following credentials to test all live features, profile sync, and card applications:**
> - 📧 **Demo Login Email**: `test1@gmail.com`
> - 🔑 **Demo Password**: `12345678`
> - ⚡ **Generate Standalone APK**: Run `eas build --platform android --profile preview` or `cd android && ./gradlew assembleRelease`

---

## 📱 Visual Screen Showcase & Core Feature Walkthrough

| Screen | Core Feature & Technical Description |
| :--- | :--- |
| **1. Precision Splash Screen** | **Brand Identity & App Loading**: Dark emerald splash screen featuring the text-free 3D metallic crest shield logo (`klysavo.AI - PRECISION INTELLIGENCE`). Dismisses native static splash within milliseconds and renders animated pulse ring. |
| **2. Instant AI Application Overview** | **Product Onboarding Overview**: Displays selected product (*Klysavo Fast Track Car Loan*, *Imtiaz Gold Credit Card*), instant AI badge, and 5-step roadmap (`Scan ID` → `ID Details` → `Address Details` → `Emergency Contact` → `Employment Details`). |
| **3. CPR ID Camera Scanner (Step 1)** | **Identity Verification**: Real-time camera scanner viewport with dashed framing guides (`Position CPR ID inside frame`), camera permission prompts, base64 preview encoding, and re-scan triggers. |
| **4. Address Details (Step 3)** | **Location & Compliance**: Clean minimal underline form inputs collecting Building/Villa Number (`1042`), Road/Street (`3819`), Block (`338`), and City/Area (`Manama`) with auto-save progress tracking. |
| **5. Profile & Photo Action Sheet** | **Account Management & Compressed Photo Upload**: Verified account profile editor with action sheet (`Take Photo`, `Select from Library`, `Remove Photo`). Features on-device JPEG compression (~40KB) stored in Firestore base64. |
| **6. Contact Us & Support Hub** | **Customer Care & Collapsible FAQs**: Full-width support options (`Call 8000 1122`, `Email support@klysavo.ai`) with interactive accordion FAQ list. |

---

## 🏛️ Architecture, Scalability & Maintainability

Klysavo is built following **Clean Architecture**, **Domain-Driven Design (DDD)**, and the **MVVM (Model-View-ViewModel)** architectural pattern. This guarantees high modularity, zero cross-feature side effects, and seamless codebase scalability.

```
c:\Users\rsumi\Projects\Klysavo\
├── app/                      # Expo Router File-Based Typed Navigation Routes
│   ├── (auth)/               # Authentication Stack (Login, Register)
│   ├── (main)/               # Main App Tab Navigator (Home, Cards, Loans, Insurance, Explore)
│   ├── apply-card.tsx        # 5-Step Application Flow Route
│   └── financial-calculator  # Financial Eligibility Calculator Routes
├── src/
│   ├── core/                 # Shared Services (Firebase, SecureStore, Theme, Typography)
│   ├── features/             # Feature Modules (auth, home, card-application, rewards, profile, etc.)
│   │   ├── data/             # Repositories, DTOs & API Implementations
│   │   ├── domain/           # Entities, Models & Business Logic
│   │   └── presentation/     # Screen UI, Components & ViewModels (MVVM)
│   └── shared/               # Reusable Components (AppHeader, Modals, Pickers, StepProgressBar)
```

---

## ⚡ State Refreshing, API Integration & Data Synchronization

### 1. Live State Refreshing & Reactive UI
- **Firebase Firestore `onSnapshot` Listeners**: Real-time multi-document snapshot listeners are bound to the `klysavo_users` collection and `applications` sub-collections. Any database mutation instantly re-evaluates local state without requiring manual page reloads or pull-to-refresh.
- **Focus-Based Screen Refreshing**: Uses Expo Router's `useFocusEffect` hook to trigger light background syncs whenever a user navigates between tabs or returns from the apply flow.
- **React 19 Hooks Engine**: Built on lightweight React state primitives (`useState`, `useMemo`, `useCallback`, `useEffect`) to ensure zero unnecessary re-renders.

### 2. API Integration & Network Layer
- **Firebase Web v11 SDK**: Uses modular Firebase Firestore calls (`doc`, `getDoc`, `setDoc`, `onSnapshot`, `serverTimestamp`) and Firebase Authentication (`initializeAuth`, `onAuthStateChanged`, `signOut`).
- **On-Device Image Compression Engine**: Profile photos captured via `expo-image-picker` (`quality: 0.75`) are processed into optimized ~40KB Base64 JPEG strings and stored directly in Firestore, bypassing heavy cloud storage bucket SDK latencies.

### 3. Dual-Layer Offline Persistence & Data Reconciliation
- **Hybrid Storage Architecture**: Combines local-first storage via Expo `SecureStore` (`expo-secure-store`) and `AsyncStorage` with background Firestore snapshot synchronization.
- **Error-Safe Application Draft Recovery**: `cleanAndDeduplicateApplications` normalizes application keys by status priority (`APPROVED` > `SUBMITTED` > `PENDING` > `DRAFT`) and recency. If network connectivity fails, draft data remains 100% intact locally.

---

## 📦 Package & Technology Stack Inventory

| Category | Package / Library | Description & Usage |
| :--- | :--- | :--- |
| **Core Framework** | `react-native` (v0.81.5) | Cross-platform UI runtime with Hermès JS engine. |
| **SDK & Routing** | `expo` (~54.0.35), `expo-router` (~6.0.24) | Expo SDK 54 file-based typed routing engine. |
| **Backend & Database**| `firebase` (^11.4.0) | Firebase Auth & Firestore real-time database. |
| **Secure Persistence**| `expo-secure-store`, `@react-native-async-storage/async-storage` | Encrypted device keychain & session storage. |
| **Image Processing** | `expo-image-picker`, `expo-image-manipulator` | Camera/gallery selection & client-side compression. |
| **UI & Animations** | `react-native-reanimated`, `@expo/vector-icons` | 60fps fluid UI animations & Ionicons iconography. |
| **Typography** | `@expo-google-fonts/manrope` | Custom Manrope font family (Regular to ExtraBold). |
| **Layout & Theme** | `react-native-safe-area-context`, `expo-status-bar` | Edge-to-edge layout & light/dark theme context. |

---

## 🛠️ Prerequisites & Local Setup Instructions

### 📋 Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x`)
- **npm**: `v9.x` or higher
- **Target**: Expo Go App, Android Emulator, or iOS Simulator.

### 🚀 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/Klysavo.git
   cd Klysavo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npx expo start
   ```

5. **Type Check & Linting**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```

---

## 📦 Building Standalone Release APK with ProGuard Obfuscation

```bash
# 1. Prebuild native Android project files
npx expo prebuild --platform android

# 2. Build obfuscated standalone Release APK via Gradle
cd android
./gradlew assembleRelease
```

**📍 Output APK Location**:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 📄 License & Contact

Developed for **Klysavo Precision AI Banking**.  
For any setup questions or technical inquiries, feel free to reach out via GitHub Issues.
