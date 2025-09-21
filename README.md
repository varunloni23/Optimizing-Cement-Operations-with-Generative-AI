# 🏭 CementAI Nexus - Optimizing Cement Operations with Generative AI

An advanced AI-powered cement plant monitoring and optimization system that leverages real-time data analysis, predictive insights, and generative AI to enhance cement manufacturing operations.

![CementAI Nexus Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

### 🤖 AI-Powered Analytics
- **Generative AI Assistant** powered by Google Gemini API
- **Predictive Quality Control** with proactive correction suggestions
- **Real-time Anomaly Detection** and automated alerts
- **Intelligent Process Optimization** recommendations

### 📊 Real-Time Dashboard
- **Live Data Visualization** with interactive charts and KPIs
- **Equipment Performance Monitoring** with health status indicators
- **Environmental Impact Tracking** with sustainability metrics
- **Production Analytics** with efficiency optimization insights

### 🔄 Real-Time Data Processing
- **WebSocket Integration** for instant data updates
- **Multi-sensor Data Aggregation** from cement plant operations
- **Historical Data Analysis** with trend identification
- **Configurable Alerts** for critical operational parameters

### ☁️ Google Cloud Integration
- **Firebase Realtime Database** for live data synchronization and storage
- **Google Cloud Storage** for document and media file management
- **BigQuery Integration** for large-scale data analytics (optional)
- **Cloud Vision API** for image analysis and OCR capabilities (optional)
- **Vertex AI Platform** for advanced ML model deployment (optional)
- **Cloud IAM** for secure access control and authentication

### 🌐 Modern Tech Stack
- **Frontend**: Next.js 15.5.3 with Turbopack, Material-UI, TypeScript
- **Backend**: Node.js with Express, Socket.IO for real-time communication
- **AI Integration**: Google Gemini API for advanced language processing
- **Data Visualization**: Recharts and MUI X-Charts for interactive displays

### 🏗️ Google Cloud Platform Stack
- **🤖 Google Gemini API**: Advanced generative AI for conversational interfaces and intelligent analysis
- **🔥 Firebase**: Real-time database, authentication, and cloud storage
  - Firebase Realtime Database for live data synchronization
  - Firebase Admin SDK for server-side operations
  - Firebase Storage for document and media management
- **🧠 Google Cloud AI Platform (Vertex AI)**: Machine learning model deployment and management
- **📊 BigQuery**: Large-scale data analytics and warehouse solutions
- **👁️ Google Cloud Vision API**: Image analysis and optical character recognition
- **☁️ Google Cloud Storage**: Scalable object storage for application data
- **🔐 Google Cloud IAM**: Identity and access management for secure operations

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Google Cloud Account** with the following APIs enabled:
  - Gemini API (Generative AI)
  - Firebase API
  - Vertex AI API (optional)
  - BigQuery API (optional) 
  - Cloud Vision API (optional)
- **Google Gemini API Key** for AI features
- **Firebase Project** with Realtime Database enabled
- **Modern web browser** with WebSocket support

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/varunloni23/Optimizing-Cement-Operations-with-Generative-AI.git
cd Optimizing-Cement-Operations-with-Generative-AI
```

### 2. Google Cloud Setup

#### 2.1 Create Google Cloud Project
```bash
# Install Google Cloud CLI (if not installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Create new project
gcloud projects create your-cement-ai-project
gcloud config set project your-cement-ai-project
```

#### 2.2 Enable Required APIs
```bash
# Enable core APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable bigquery.googleapis.com  
gcloud services enable vision.googleapis.com
gcloud services enable firebase.googleapis.com

# Enable Gemini API (Generative AI)
gcloud services enable generativelanguage.googleapis.com
```

#### 2.3 Create Service Account
```bash
# Create service account
gcloud iam service-accounts create cement-ai-service \
    --description="CementAI Nexus Service Account" \
    --display-name="CementAI Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding your-cement-ai-project \
    --member="serviceAccount:cement-ai-service@your-cement-ai-project.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding your-cement-ai-project \
    --member="serviceAccount:cement-ai-service@your-cement-ai-project.iam.gserviceaccount.com" \
    --role="roles/bigquery.dataEditor"

# Download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=cement-ai-service@your-cement-ai-project.iam.gserviceaccount.com
```

#### 2.4 Setup Firebase
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create new project or import existing Google Cloud project
3. Enable **Realtime Database** in Firebase console
4. Configure security rules for development:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
5. Get Firebase configuration from Project Settings

#### 2.5 Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key for your project
3. Copy the API key for environment configuration

### 3. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# GEMINI_API_KEY=your-gemini-api-key-here
# PORT=3001
```

### 4. Frontend Setup
```bash
cd frontend
npm install

# Create environment file  
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🚀 Running the Application

### Development Mode

**Always start backend first, then frontend:**

1. **Start Backend Server**:
```bash
cd backend
npm run dev
```
Wait for: `✅ CementAI Nexus API Server running on port 3001`

2. **Start Frontend Application**:
```bash
cd frontend
npm run dev
```
Wait for: `✓ Ready in XXXms`

3. **Access the Application**:
   - Dashboard: http://localhost:3000
   - API Health: http://localhost:3001/health

### Production Build

1. **Build Backend**:
```bash
cd backend
npm run build
npm start
```

2. **Build Frontend**:
```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
├── backend/                    # Node.js API Server
│   ├── src/
│   │   ├── ai/                # AI service integration
│   │   ├── data/              # Data models and adapters
│   │   ├── services/          # External service integrations
│   │   ├── simulation/        # Data simulation for demo
│   │   └── index.ts           # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Next.js React Application
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── config/            # API configuration
│   │   └── theme/             # Material-UI theming
│   ├── package.json
│   └── next.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Required - Google Cloud & AI Services
GEMINI_API_KEY=your-gemini-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Required - Application Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id

# Optional - Advanced Google Cloud Services
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_ENDPOINT=your-vertex-endpoint
BIGQUERY_DATASET_ID=cement_plant_data
VISION_API_KEY=your-vision-api-key

# Optional - Application Tuning
PLANT_CAPACITY=2000
SENSOR_COUNT=50
SIMULATION_INTERVAL=5000
```

#### Frontend (.env.local)
```env
# Required
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🌐 Deployment

### Render Platform (Recommended)

1. **Deploy Backend**:
   - Create Node.js service on Render
   - Set environment variables (especially `GEMINI_API_KEY`)
   - Use build command: `npm run build`
   - Use start command: `npm start`

2. **Deploy Frontend**:
   - Create Static Site on Render
   - Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL
   - Use build command: `npm run build`
   - Use publish directory: `out`

### Other Platforms
- **Vercel**: Excellent for frontend deployment
- **Heroku**: Good for both frontend and backend
- **AWS/GCP**: Enterprise deployment options

## 🔍 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `GET /api/dashboard/data` - Dashboard data
- `POST /api/ai/chat` - AI Assistant chat
- `POST /api/ai/proactive-quality-corrections` - Quality recommendations

### WebSocket Events
- `dashboard_update` - Real-time dashboard updates
- `sensor_data` - Live sensor readings
- `connect/disconnect` - Connection status

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend
2. Open browser to http://localhost:3000
3. Verify real-time data updates
4. Test AI Assistant functionality
5. Check WebSocket connections in browser dev tools

### Health Checks
- Backend: http://localhost:3001/health
- API Status: http://localhost:3001/api/health

## 🛠️ Troubleshooting

### Common Issues

**WebSocket Connection Errors**:
- Ensure backend is running before frontend
- Check `NEXT_PUBLIC_BACKEND_URL` configuration
- Verify no port conflicts on 3001

**AI Assistant Not Responding**:
- Verify `GEMINI_API_KEY` is set correctly
- Check backend logs for API errors
- Ensure internet connectivity for API calls

**Build Failures**:
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility
- Verify TypeScript configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Google Cloud Platform & AI Services
- **Google Gemini API** for cutting-edge generative AI capabilities
- **Firebase** for real-time database and cloud infrastructure
- **Google Cloud AI Platform (Vertex AI)** for machine learning operations
- **BigQuery** for large-scale data analytics and insights
- **Google Cloud Vision API** for advanced image processing
- **Google Cloud Storage** for scalable data storage solutions

### Development Frameworks & Libraries  
- **Next.js Team** for the excellent React framework
- **Material-UI** for beautiful component design
- **Socket.IO** for real-time communication
- **TypeScript** for enhanced development experience

### Industry & Domain
- **Cement Industry Experts** for domain knowledge and insights
- **Industrial IoT Community** for sensor integration patterns
- **AI/ML Research Community** for optimization algorithms

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the troubleshooting section above
- Review the deployment checklist in `DEPLOYMENT_CHECKLIST.md`

---

**Built with ❤️ for the cement industry** - Optimizing operations through AI innovation.