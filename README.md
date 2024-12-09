# Band Manager - Frontend

## 🎸 Overview

Band Manager is a collaborative platform designed for musicians and bands to efficiently manage their music projects and band administration in one place.

## 🌟 Features

- Share songs and tablatures privately within your band
- Manage administrative tasks through spreadsheets
- Organize events (rehearsals, concerts)
- Discover other musicians and projects
- Private and public project management
- Real-time collaboration tools
- Event planning and management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see Backend README)

### Installation

```bash
# Clone the repository
git clone https://github.com/innermost47/band-manager-client.git

# Navigate to project directory
cd band-manager-client

# Install dependencies
npm install
# or
yarn install

# Create .env file
cp .env.example .env

# Start development server
npm start
# or
yarn start
```

### Environment Variables

Create a `.env` file with the following variables:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_COMPANY_NAME=Band Manager
REACT_APP_COMPANY_ADDRESS=
REACT_APP_COMPANY_EMAIL=
REACT_APP_COMPANY_PHONE=
REACT_APP_HOSTING_PROVIDER=
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.
