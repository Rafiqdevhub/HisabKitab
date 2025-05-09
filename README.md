# HisabKitab - Personal Budget Tracker

<div align="center">
  <img src="./assets/images/icon.png" alt="HisabKitab Logo" width="120"/>
</div>

## Description

HisabKitab is a comprehensive personal budget tracking application built with React Native and Expo. It helps users manage their finances by tracking expenses, setting budgets, and monitoring spending across different categories.

## Features

- 📊 Budget Overview Dashboard
- 💰 Category-wise Expense Tracking
- 📈 Visual Progress Tracking
- 🔄 Real-time Budget Updates
- 📱 Cross-platform (iOS & Android)
- 💾 Local Data Storage
- 📄 PDF Report Generation
- 🌐 Multiple Currency Support
- 🔔 Haptic Feedback
- 🎨 Beautiful UI with Gradient Design

## Technology Stack

- React Native with Expo
- TypeScript
- NativeWind (TailwindCSS)
- Expo Router
- AsyncStorage for Data Persistence
- React Native Reanimated
- Linear Gradient
- Expo Haptics
- Font Awesome Icons

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Testing the App

You can test the app by downloading the APK from the `/apk` directory of this repository. The APK is available for Android devices.

### Steps to Install APK:

1. Download the APK from `/apk` folder
2. Enable "Install from Unknown Sources" in your Android settings
3. Install the APK on your device
4. Launch HisabKitab

## Features Breakdown

### Home Screen

- Total budget overview
- Spending progress visualization
- Category-wise expense distribution
- Real-time budget status indicators

### Budget Management

- Set total budget
- Allocate category budgets
- Add transactions
- Reset category or total budget
- Transaction history

### Settings

- Currency customization (PKR, USD, EUR, GBP, JPY, INR)
- Export budget report as PDF
- Data management options
- App information

## App Structure

```
app/
├── _layout.tsx        # Main app layout with tab navigation
├── (tabs)/
│   ├── index.tsx     # Home screen
│   ├── budget.tsx    # Budget management
│   └── settings.tsx  # App settings
context/
└── BudgetContext.tsx # Global state management

```

## Development

### Prerequisites

- Node.js >= 14
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Environment Setup

1. Install Expo CLI:

```bash
npm install -g expo-cli
```

2. Install project dependencies:

```bash
npm install
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- Expo Team for the amazing framework
- React Native Community
- TailwindCSS Team
- Font Awesome for the icons
