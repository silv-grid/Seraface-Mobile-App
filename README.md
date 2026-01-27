# SeraFace Mobile App

<div align="center">
  
  **AI-Powered Skincare Analysis & Recommendation Platform**
  
  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
  ![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)
  ![Expo](https://img.shields.io/badge/Expo-54.0.32-000020.svg)
  ![Platform](https://img.shields.io/badge/platform-Android-green.svg)
  
</div>

---

## ⚠️ Important Notice

**This is a prototype application designed for rapid prototyping and showcase purposes only.**

- 🔓 **No Authentication**: User authentication is not implemented in this version
- 🖥️ **Backend Required**: The backend server must be running locally for the app to function
- 📱 **Mobile Only**: This version is optimized for mobile platforms (Android)
- 🚧 **Development Status**: Active development - features may be incomplete or subject to change

---

## 📥 Download

**[Download APK (Android)](https://tinyurl.com/serafaceMobile)**

> ⚠️ **Showcase Build**: This APK is for demonstration and testing purposes only. Ensure the backend server is running before using the app.

---

## 📖 Overview

SeraFace is an intelligent skincare companion that leverages AI technology to provide personalized skincare recommendations. The app combines facial image analysis, skin profile assessments, and community-driven insights to help users build effective skincare routines tailored to their unique needs.

### ✨ Key Features

- **📸 AI Skin Analysis**: Upload selfies for advanced AI-powered skin condition analysis
- **👤 Personalized Skin Profiling**: Create detailed skin profiles based on skin type, concerns, and preferences
- **🎯 Smart Product Recommendations**: Get curated product suggestions based on your skin profile
- **📅 Custom Skincare Routines**: Build and manage morning and evening skincare routines
- **💰 Budget Planning**: Track skincare expenses and plan purchases with budget tools
- **🗺️ Community & Discovery**: Explore skincare locations and connect with the community
- **💬 AI Chat Assistant**: Get skincare advice and answers to your questions

---

## 🛠️ Technology Stack

### Frontend

- **React Native** `0.81.5` - Cross-platform mobile framework
- **Expo** `54.0.32` - Development platform for React Native
- **React Navigation** `7.x` - Navigation library for screen routing
- **Redux Toolkit** `2.8.2` - State management with Redux
- **NativeWind** `4.1.23` - Tailwind CSS for React Native
- **Expo Linear Gradient** - Gradient components
- **Lucide React Native** - Icon library

### Core Dependencies

- **Axios** `1.11.0` - HTTP client for API communication
- **React Native Gesture Handler** - Touch and gesture handling
- **React Native Reanimated** - Smooth animations
- **Expo Image Picker** - Camera and gallery access
- **Redux Persist** - State persistence

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** `22.14.0` or higher
- **npm** or **yarn** package manager
- **Expo CLI** (installed globally)
- **Android Studio** (for Android development)
- **JDK 17** or higher
- **Backend Server** (must be running on `http://127.0.0.1:8000`)

### Android Development Setup

- Android SDK Platform 34 or higher
- Android Virtual Device (AVD) or physical Android device
- USB debugging enabled (for physical devices)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Seraface-Mobile-App
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Backend Connection

Ensure your backend server is running at `http://127.0.0.1:8000`. The API configuration can be found in:

- `store/api/axios.js`

If your backend runs on a different address, update the `BASE_URL` constant accordingly.

### 4. Start the Development Server

```bash
npm start
```

or

```bash
npx expo start
```

### 5. Run on Android

**Option 1: Using Expo Go (Recommended for testing)**

```bash
npm run android
```

**Option 2: Development Build**

```bash
npx expo run:android
```

**Option 3: Physical Device**

- Install Expo Go from Google Play Store
- Scan the QR code from the terminal/browser

---

## 🏗️ Building for Production

### Android APK Build

Using Expo Application Services (EAS):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
eas build --platform android --profile preview
```

### Local Build

```bash
npx expo run:android --variant release
```

---

## 📁 Project Structure

```
Seraface-Mobile-App/
├── assets/                      # Images, fonts, and static assets
├── components/                  # Reusable UI components
│   ├── Budget_Screen/          # Budget-related components
│   ├── Home_Screen/            # Home screen components
│   │   ├── Main_Home/          # Main home view
│   │   ├── Phase1_SkinProfile/ # Skin profiling components
│   │   ├── Phase2_ScanFace/    # Face scanning components
│   │   ├── Phase3_ScanFace/    # Scan results components
│   │   └── Results/            # Analysis results components
│   ├── Routines_Screen/        # Routine management components
│   └── UI_Common/              # Common UI elements
│       ├── Buttons/            # Button components
│       ├── Commons/            # Shared components
│       ├── Gradients/          # Gradient-styled components
│       └── Lists/              # List components
├── constants/                   # App constants (colors, gradients)
├── screens/                     # Screen components
│   ├── Major_Screens/          # Main tab screens
│   │   ├── BudgetScreen.jsx
│   │   ├── ChatScreen.jsx
│   │   ├── CommunityScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── ProductsScreen.jsx
│   │   └── RoutinesScreen.jsx
│   └── Minor_Screens/          # Nested/modal screens
│       ├── Community/
│       ├── Home/
│       ├── Products/
│       └── Routine/
├── store/                       # Redux state management
│   ├── api/                    # API configuration
│   │   ├── axios.js            # Axios instance
│   │   ├── customBaseQuery.js  # RTK Query base
│   │   ├── skincareApi.js      # API endpoints
│   │   └── index.js
│   ├── slices/                 # Redux slices
│   │   ├── authSlice.js
│   │   ├── skincareSlice.js
│   │   └── index.js
│   ├── index.js                # Store configuration
│   └── rootReducer.js          # Combined reducers
├── util/                        # Utility functions
├── App.js                       # Main app component
├── app.config.js               # Expo configuration
├── eas.json                    # EAS Build configuration
├── package.json                # Dependencies and scripts
├── metro.config.js             # Metro bundler configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── babel.config.js             # Babel configuration
└── global.css                  # Global styles
```

---

## 🎨 App Screens

### Main Screens (Bottom Navigation)

1. **Home** - Dashboard with skin analysis options
2. **Products** - Browse and search skincare products
3. **Routines** - Manage morning and evening skincare routines
4. **Budget** - Track expenses and plan skincare purchases
5. **Community** - Discover locations and community features

### Secondary Screens

- **Skin Profile** - Create and edit skin profile questionnaire
- **Scan Face** - Capture selfies for AI analysis
- **Results** - View detailed skin analysis results
- **Product Details** - Individual product information
- **Set Routine** - Create custom skincare routines
- **Diet Screen** - Dietary recommendations for skin health
- **Chat** - AI-powered skincare assistant
- **Map** - Community location discovery

---

## 🔌 API Integration

The app communicates with a backend API running at `http://127.0.0.1:8000`.

### API Configuration

- **Base URL**: Configured in `store/api/axios.js`
- **Timeout**: 15 seconds
- **Content Type**: `application/json`

### API Features

- RTK Query for efficient data fetching and caching
- Request/Response interceptors for logging
- Error handling and retry logic
- Redux state integration

**Note**: The backend server must be running for the app to fetch data, submit skin profiles, and retrieve recommendations.

---

## 🎨 Styling & Theming

### NativeWind (Tailwind CSS)

The app uses NativeWind for utility-first styling, providing responsive and consistent design across components.

### Custom Components

- **GradientText** - Text with gradient effects
- **GradientIcon** - Icons with gradient fills
- **GradientView** - Container views with gradients
- **GradientHeaderTitle** - Styled navigation headers

### Color Scheme

Defined in `constants/colors.js` and `constants/gradients.js`:

- Primary colors with gradient variations
- Consistent theme across the app
- Dark/light mode considerations

---

## 🧪 Development Scripts

```bash
# Start Expo development server
npm start

# Run on Android emulator/device
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run in web browser
npm run web

# Clear Metro bundler cache
npx expo start -c

# Check for issues
npx expo-doctor
```

---

## 🐛 Troubleshooting

### Common Issues

**App won't connect to backend:**

- Ensure backend server is running on `http://127.0.0.1:8000`
- For physical devices, use your computer's IP address instead of localhost
- Check firewall settings allowing connections on port 8000

**Build errors:**

- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version matches requirements

**Metro bundler issues:**

- Restart Metro bundler
- Check for conflicting processes on port 8081
- Verify `metro.config.js` configuration

**Gradle build fails:**

- Clean Android build: `cd android && ./gradlew clean`
- Check JDK version (requires JDK 17+)
- Verify Android SDK installation

---

## 📱 Testing

### Running on Physical Device

**Android:**

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Run `npm run android`
5. Update `BASE_URL` in `axios.js` to your computer's local IP address

**Testing Checklist:**

- [ ] Skin profile creation flow
- [ ] Image picker and camera functionality
- [ ] Skin analysis submission and results
- [ ] Product browsing and search
- [ ] Routine creation and management
- [ ] Budget tracking features
- [ ] Navigation between screens
- [ ] Redux state persistence

---

## 🔐 Security Notes

**Current Prototype Limitations:**

- No user authentication implemented
- No data encryption in transit (HTTP only)
- Local storage without encryption
- No input validation on client side
- Backend API endpoints unprotected

**For Production:**

- Implement JWT or OAuth authentication
- Use HTTPS for all API communications
- Add input validation and sanitization
- Implement proper error boundaries
- Add analytics and crash reporting

---

## 🚀 Future Enhancements

- [ ] User authentication and authorization
- [ ] Profile synchronization across devices
- [ ] Push notifications for routine reminders
- [ ] Social features and community interactions
- [ ] Advanced AI model integration
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode optimization
- [ ] Product barcode scanning
- [ ] Integration with e-commerce platforms

---

## 👥 Contributors

This project is maintained for rapid prototyping and educational purposes.

---

## 📞 Support

For issues, questions, or contributions, please contact the development team or open an issue in the project repository.

---

## 🙏 Acknowledgments

- Built with React Native and Expo
- UI components inspired by modern mobile design patterns
- AI analysis powered by backend machine learning models
- Icons by Lucide and Ionicons

---

<div align="center">
  
  **Built with ❤️ for better skincare**
  
  *SeraFace Mobile v1.0.0*
  
</div>
