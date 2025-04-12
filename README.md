# Analytics Dashboard

A React-based analytics dashboard that visualizes customer data using D3.js charts and Material-UI components.

## Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)

## Project Structure

```
analytics-dashboard/
├── data/                    # JSON data files
│   ├── Account Industry.json
│   ├── ACV Range.json
│   ├── Customer Type.json
│   └── Team.json
├── server/                  # Backend server
│   └── index.js
├── src/                     # Frontend source code
│   ├── components/         
│   │   ├── BarChart.tsx
│   │   └── DoughnutChart.tsx
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `data` directory in the project root and add the JSON files:
   - Account Industry.json
   - ACV Range.json
   - Customer Type.json
   - Team.json

## Running the Application

1. Start the backend server:
```bash
npm run server
```
The server will start on port 3001.

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

## Features

- Interactive data visualization using D3.js
- Stacked bar charts showing ACV distribution over time
- Doughnut charts displaying customer type distribution
- Detailed data tables with sorting capabilities
- Responsive design using Material-UI Grid system

## Technology Stack

### Frontend
- React 18
- TypeScript
- D3.js for data visualization
- Material-UI for components
- Tailwind CSS for styling
- Vite for development and building

### Backend
- Node.js
- Express.js
- File-based JSON data storage

## Development

- Frontend code is in the `src` directory
- Backend code is in the `server` directory
- Data files should be placed in the `data` directory
- Components are in `src/components`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Endpoints

The backend server provides the following endpoint:

- `GET /api/data` - Returns all data sets (Account Industry, ACV Range, Customer Type, Team)

## Notes

- The backend server includes CORS headers for local development
- The frontend automatically connects to the backend at `http://localhost:3001`
- Charts are responsive and will resize based on container width
- Data is loaded once when the application starts
