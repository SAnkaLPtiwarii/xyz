# Dynamic Landing Page

This project is a dynamic landing page that generates content based on user search queries. It uses Node.js with Express for the backend, MongoDB for data storage, and vanilla JavaScript for the frontend.

## Features

- Dynamic content generation based on search keywords
- MongoDB integration for content storage
- Responsive design
- SEO-friendly dynamic URLs

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (usually comes with Node.js)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dynamic-landing-page.git
   cd dynamic-landing-page
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

   If you're using a local MongoDB installation, your URI might look like this:
   ```
   MONGODB_URI=mongodb://localhost:27017/dynamicLandingPage
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:3000`

3. Use the search bar to enter keywords and see dynamically generated content

## Project Structure

```
project-root/
│
├── public/
│   ├── index.html
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       └── main.js
├── src/
│   ├── models/
│   │   └── Content.js
│   ├── routes/
│   │   └── contentRoutes.js
│   └── controllers/
│       └── contentController.js
├── server.js
├── .env
├── package.json
└── README.md
```

## How It Works

1. The server (`server.js`) sets up an Express application and connects to MongoDB.
2. When a user searches for a keyword:
   - The frontend (`public/scripts/main.js`) sends a request to the `/api/content` endpoint.
   - The backend (`src/controllers/contentController.js`) processes this request.
   - If content for the keyword exists in the database, it's returned.
   - If not, new content is generated, saved to the database, and then returned.
3. The frontend updates the page with the received content without reloading.

## Customization

- To modify the content generation logic, edit `src/controllers/contentController.js`.
- To change the frontend behavior, edit `public/scripts/main.js`.
- To adjust the page layout or styling, modify `public/index.html` and `public/styles/main.css`.

## Contributing

Contributions to this project are welcome. Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
