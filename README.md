# Filo - CA Helper

A modern AI-powered web application designed to assist Chartered Accountants (CAs) and their clients in managing tax filings, document submissions, and financial compliance tasks efficiently.

## 🎯 Overview

Filo is a comprehensive platform that streamlines the interaction between CAs and their clients. The application provides an intuitive interface for clients to submit requests, upload documents, and track the progress of their tax filings and compliance tasks. Built with modern web technologies, Filo offers a seamless experience for managing GST returns, Income Tax Returns (ITR), TDS filings, and other accounting services.

## ✨ Features

### Client Portal (Currently Implemented)

- **Dashboard**: Overview of tasks, requests, and quick actions
- **Request Management**: Create and track new requests with AI assistance
- **AI-Powered Chat**: Interactive chat interface for guidance and support
- **Document Upload**: Secure file upload system supporting multiple formats (PDF, Word, Excel, Images)
- **Task Tracking**: Real-time progress tracking for ongoing tasks
- **Request History**: View and access all previous requests
- **Rich Text Support**: AI responses with formatted text, lists, and structured information

### CA Portal (Coming Soon)

- Task management and assignment
- Document review and approval
- Client communication tools
- Compliance tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v3** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

### State Management & Storage
- **localStorage** - Client-side data persistence (temporary, will migrate to Supabase)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
ca_helper/
├── src/
│   ├── client/              # Client role specific code
│   │   ├── components/      # Client-specific components
│   │   │   └── ClientLayout.tsx
│   │   └── pages/           # Client pages
│   │       ├── ClientDashboard.tsx
│   │       ├── ClientProfile.tsx
│   │       ├── ClientDocuments.tsx
│   │       ├── ClientChat.tsx
│   │       ├── CreateNewRequest.tsx
│   │       └── RequestDetail.tsx
│   ├── CA/                  # CA role specific code (future)
│   ├── components/          # Shared components
│   │   ├── common/          # Common reusable components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── RequestCard.tsx
│   │   │   ├── QuickActionCard.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChecklistCard.tsx
│   │   │   ├── DocumentSidebar.tsx
│   │   │   ├── RichTextRenderer.tsx
│   │   │   └── FrequentlyUsedRequest.tsx
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── progress.tsx
│   │       └── textarea.tsx
│   ├── data/                # Mock data
│   │   └── mockData.ts
│   ├── lib/                 # Utility libraries
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # localStorage helpers
│   │   ├── mockAI.ts        # Mock AI responses
│   │   └── documentUtils.ts # Document utilities
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **Yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Hemanth-2002/filo.git
cd filo
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `yarn dev` - Start development server with hot module replacement
- `yarn build` - Build the application for production
- `yarn preview` - Preview the production build locally
- `yarn lint` - Run ESLint to check code quality

## 🎨 Key Features Breakdown

### 1. Request Creation
- Users can create new requests with detailed descriptions
- Frequently used request templates for quick access
- Automatic request ID generation and storage

### 2. AI Chat Interface
- Real-time chat with AI assistant
- Rich text rendering for formatted responses
- Message history persistence
- Auto-scrolling to latest messages
- Loading indicators during AI responses

### 3. Document Management
- Sidebar panel for document requirements
- Multi-format file upload (PDF, Word, Excel, Images)
- Progress tracking for document completion
- Visual feedback for uploaded documents
- Task-based document organization

### 4. Dashboard
- Quick action cards for common tasks
- Recent requests overview
- Task progress visualization
- Statistics and metrics display

### 5. Navigation
- Role-based routing structure
- Persistent sidebar navigation
- Breadcrumb navigation
- Active route highlighting

## 🔄 Data Flow

Currently, the application uses **localStorage** for data persistence:

- **Requests**: Stored in `ca_helper_requests`
- **Chat Messages**: Stored per request in `ca_helper_chats_{requestId}`
- **User Data**: Mock data (will be replaced with authentication)

**Note**: The application is designed to migrate to Supabase for backend services, authentication, and database operations in the future.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Client portal UI/UX
- ✅ Request creation and management
- ✅ AI chat interface
- ✅ Document upload system
- ✅ Task tracking

### Phase 2 (Planned)
- [ ] Supabase integration
- [ ] User authentication
- [ ] Real AI/LLM integration
- [ ] Database schema implementation
- [ ] File storage integration

### Phase 3 (Future)
- [ ] CA portal development
- [ ] Real-time notifications
- [ ] Advanced document processing
- [ ] Analytics and reporting
- [ ] Mobile responsive optimization

## 🤝 Contributing

This is a private project. For contributions, please contact the repository maintainers.

## 📝 License

Private - All rights reserved

## 👥 Team

Developed for Hemanth-2002

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
