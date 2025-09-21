# ChaitanyaAI - AI-Powered Marketplace Assistant for Artisans

ChaitanyaAI is a web application designed to empower small businesses, MSMEs, and local artisans by providing them with a suite of powerful AI-driven tools. It helps them create compelling marketing content, understand market trends, optimize their online store listings, and manage customer communications, all from a single, easy-to-use dashboard.

## The Problem We Solve

Talented artisans and small business owners often excel at creating beautiful products but may lack the time, budget, or specialized marketing skills to stand out in a crowded digital marketplace. They face challenges in:
- Writing compelling product descriptions and brand stories that connect with customers.
- Keeping up with social media trends and creating engaging content.
- Optimizing their online store listings for search engines on platforms like Etsy and Shopify.
- Analyzing market trends to inform their product and marketing strategies.

ChaitanyaAI is designed to be a virtual marketing assistant, leveling the playing field and allowing these creators to focus on what they do best: creating.

## Key Features

- **AI-Powered Content Generation**: Instantly generate authentic brand stories, compelling product descriptions, and engaging social media captions.
- **Platform-Tailored Captions**: Create content specifically optimized for different social media platforms, including Instagram, X (Twitter), and LinkedIn.
- **Marketplace SEO Optimization**: Get SEO-optimized titles and tags for **Etsy** and **Shopify** to improve visibility and attract organic traffic.
- **Market Trend Analysis**: Gain valuable insights into popular SEO keywords, trending color palettes, and popular product styles for any industry.
- **AI Email Responder**: Quickly draft professional emails for customer inquiries, follow-ups, and other business correspondence in various tones.
- **Content Translation**: Translate product descriptions and other content into multiple languages to reach a global audience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google's Gemini Pro via Genkit](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    Create a file named `.env` in the root of your project and add your Gemini API key.
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
    You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Powered by Google Cloud

This project is proudly powered by Google's cutting-edge AI and cloud technologies.

<div align="center">
  <a href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer"><img src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758454710/Google_Cloud_logo.svg_sfwwbj.png" width="150" alt="Google Cloud Logo" style="margin: 10px;"/></a>
  <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer"><img src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758456539/New_Google_Gemini_logo_2025_vvsg89.png" width="120" alt="Gemini Logo" style="margin: 10px;"/></a>
  <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer"><img src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758454709/firebase_logo_daipos.svg" width="140" alt="Firebase Logo" style="margin: 10px;"/></a>
  <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer"><img src="https://res.cloudinary.com/dnhx7xyz2/image/upload/v1758456762/Newvertixailogo-3-_1_tp9oqr.png" width="140" alt="Vertex AI Logo" style="margin: 10px;"/></a>
</div>
