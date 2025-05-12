# HisabKitab - Personal Budget Tracker

## Description

HisabKitab is a comprehensive personal budget tracking application built with React Native and Expo. It helps users manage their finances by tracking expenses, setting budgets, and monitoring spending across different categories. The app features an intuitive, modern UI with haptic feedback and smooth animations.

## Features

- 📊 Budget Overview Dashboard
  - Month-wise budget tracking
  - Total budget and spending overview
  - Remaining budget calculation
  - Visual progress tracking with colored indicators
- 💰 Category Management
  - 7 preset categories (Food, Education, Bills, Doctor, Transport, Grocery, Others)
  - Individual category budgets
  - Transaction tracking per category
  - Visual spending progress bars
  - Category-specific icons and color coding
- 📱 Smart Features
  - Monthly data persistence using AsyncStorage
  - Individual transaction logging with descriptions
  - Category-wise budget reset options
  - Transaction history maintenance
- 🌐 Currency Support

  - Multiple currency symbol support
  - Configurable currency display
  - Default currency: PKR

- 🎨 Enhanced User Experience
  - Beautiful gradient UI design
  - Haptic feedback for actions
  - Smooth animations using Reanimated
  - Modern, minimalist interface
  - Backdrop blur effects

## Technology Stack

- React Native with Expo
- TypeScript for type safety
- NativeWind (TailwindCSS) for styling
- Expo Router for navigation
- AsyncStorage for data persistence
- React Native Reanimated for animations
- Linear Gradient for UI effects
- Expo Haptics for tactile feedback
- Font Awesome icons for visual elements

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Rafiqdevhub/HisabKitab.git
cd HisabKitab
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

## Testing the App

The app can be tested using the Expo Go client or by building a APK.

### Using Expo Go:

1. Install Expo Go on your device from the App/Play Store
2. Start the development server: `npm expo start`
3. Scan the QR code with Expo Go

### Using APK:

Pre-built APK is available in the `/apk` directory:

1. Download the APK from `/apk` folder
2. Enable "Install from Unknown Sources" in Android settings
3. Install and launch HisabKitab

## Core Features

### Home/Overview Screen

- Monthly budget overview with progress visualization
- Total budget and spending summaries
- Category-wise expense distribution
- Visual progress tracking with animations

### Budget Management

- Set and manage total monthly budget
- Configure individual category budgets
- Add and track transactions with descriptions
- Reset options for categories and total budget
- Detailed transaction history per category

### Settings & Utilities

- Currency symbol customization
- Monthly data persistence and management
- PDF Generator

## App Structure

```
app/
├── _layout.tsx        # Main app layout with tab navigation
├── global.css        # Global styles
├── (tabs)/
│   ├── index.tsx     # Home/Overview screen
│   ├── budget.tsx    # Budget & transaction management
│   └── settings.tsx  # App settings & exports
assets/
├── fonts/           # Custom fonts
└── images/          # App icons and images
context/
└── BudgetContext.tsx # Global state management with:
                     # - Budget tracking
                     # - Category management
                     # - Transaction handling
                     # - Data persistence
```

## Development

### Prerequisites

- Node.js >= 14
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Key Features Implementation

1. **State Management**:

   - Uses React Context API via `BudgetContext.tsx`
   - Handles budget, categories, and transactions
   - Implements data persistence with AsyncStorage

2. **Budget Tracking**:

   - Monthly budget allocation
   - Category-wise expense tracking
   - Transaction history with descriptions
   - Automatic calculations for remaining amounts

3. **User Interface**:
   - Responsive design with NativeWind
   - Animated components with Reanimated
   - Haptic feedback for better UX
   - Gradient and blur effects

### Environment Setup

1. Install Expo CLI:

```bash
npm install -g expo-cli
```

2. Install project dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm expo start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Acknowledgements

- Expo Team for the amazing framework
- React Native Community
- TailwindCSS Team
- Font Awesome for the icons
