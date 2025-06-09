# Bharat's Open Source ExplainMyMutations.AI

## Project Description

Bharat's Open Source ExplainMyMutations.AI is a powerful generative tool designed to demystify genetic mutations. It can explain somatic or germline mutations in either patient-friendly, layman's terms or precise, clinician-ready language. The explanations are generated using Google's Gemini AI model, leveraging information from various authoritative biomedical databases.

This application aims to bridge the communication gap between complex genetic data and different audiences, providing clear, context-specific information.

## Features

* **Dual Explanation Modes:**
    * **Patient-Friendly Mode:** Explains mutations in simple, empathetic, and understandable language, avoiding jargon and using analogies. It also provides key questions patients might ask their doctor.
    * **Clinician-Focused Mode:** Provides concise, technically accurate information, including functional impact, associated diseases, clinical significance (diagnostic, prognostic, therapeutic), variant classification, and population frequency, based on current knowledge from biomedical databases. It also suggests points for further clinical consideration.
* **AI-Powered Explanations:** Utilizes Google's Gemini API (specifically `gemini-2.5-flash-preview-04-17`) to generate comprehensive explanations.
* **Information Grounding (for Clinician Mode):** The clinician-focused explanations can incorporate Google Search grounding for up-to-date information on emerging research or therapeutic approvals. This helps ensure the information is as current as possible by referencing external web sources.
* **Dynamic UI:** Features a responsive user interface with a mutation input form, explanation display, and a loading spinner.
* **Search History:** Keeps a history of recent mutation queries for easy access and re-explanation.
* **Copy & Share:** Allows users to easily copy the full explanation or a shareable summary to their clipboard.
* **Relevant Resources:** Provides links to general genetics resources and mentions the biomedical databases used for information synthesis.

## How it Works (Theory)

The application functions by taking a genetic mutation as input from the user and an explanation mode (patient or clinician).

1.  **User Input & Mode Selection:** The `MutationInputForm.tsx` component captures the user's mutation query and their selected explanation mode.
2.  **API Call:** The `App.tsx` component triggers the `generateExplanation` function from `geminiService.ts`.
3.  **Prompt Generation:** Inside `geminiService.ts`, a specific prompt is constructed based on the chosen `explanationMode`.
    * **Patient Prompt:** Designed to simplify complex genetic concepts, provide context, and offer a clear disclaimer about not being medical advice. It asks the AI to cover what the mutation is, what the gene normally does, how the change affects the gene, what it could mean for health generally, and its commonality.
    * **Clinician Prompt:** Focused on technical accuracy and clinical relevance, requesting details on gene alteration, functional impact, associated diseases, clinical significance (diagnostic, prognostic, therapeutic), variant classification, population frequency, and key database annotations. It also enables search grounding to fetch real-time information.
4.  **Gemini API Interaction:** The `generateExplanation` function makes a call to the Google Gemini API (`gemini-2.5-flash-preview-04-17` model) with the generated prompt. For clinician mode, the `googleSearch` tool is enabled in the API configuration to allow the model to search for additional, up-to-date information.
5.  **Response Processing:** The API returns an explanation. The application then parses this response, extracting the main explanation text and any "Key Questions" or "Points for Further Consideration" that the AI generates, which are prefixed by specific headers.
6.  **Display:** The `ExplanationDisplay.tsx` component renders the generated explanation, and `KeyQuestionsDisplay.tsx` renders the relevant questions, providing a clear and organized output to the user.

The AI synthesizes information from publicly available data from sources like:
* **COSMIC** (Catalogue Of Somatic Mutations In Cancer)
* **ClinVar** (NCBI)
* **OncoKB** (Precision Oncology Knowledge Base)
* **CIViC** (Clinical Interpretations of Variants in Cancer)
* And other biomedical literature.

## Disclaimer

This tool is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Run Locally

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set the `GEMINI_API_KEY`:** Create a `.env.local` file in the root directory and set your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
3.  **Run the app:**
    ```bash
    npm run dev
    ```

This will start the development server, and you can access the application in your web browser, typically at `http://localhost:5173/`.

## Technologies Used

* **React 19:** A JavaScript library for building user interfaces.
* **TypeScript:** A strongly typed superset of JavaScript that compiles to plain JavaScript.
* **Vite:** A fast build tool that provides a lightning-fast development experience.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
* **Google Gemini API (`@google/genai`):** The primary AI model used for generating explanations.

## Project Structure (Key Files)

* `public/`: Static assets.
* `src/`:
    * `App.tsx`: The main application component, handling state, history, and coordinating explanations.
    * `index.tsx`: Entry point for the React application.
    * `types.ts`: Defines TypeScript interfaces and enums used across the application, including `ExplanationMode` and `GroundingMetadata`.
    * `components/`: Contains reusable React components.
        * `ExplanationDisplay.tsx`: Displays the generated mutation explanation and sources.
        * `KeyQuestionsDisplay.tsx`: Renders key questions for patients or clinicians.
        * `MutationInputForm.tsx`: Handles user input for mutation and mode selection.
        * `Header.tsx`: Application header.
        * `Footer.tsx`: Application footer with disclaimers and resources.
        * `LoadingSpinner.tsx`: Displays a loading animation.
    * `services/`:
        * `geminiService.ts`: Contains the logic for interacting with the Google Gemini API, including prompt construction and response parsing.
* `README.md`: This file.
* `package.json`: Project dependencies and scripts.
* `tsconfig.json`: TypeScript compiler configuration.
* `vite.config.ts`: Vite build tool configuration, including API key handling.
* `metadata.json`: Application metadata.

## License

This project is open-source. Please refer to the specific license file if available, or assume a standard open-source license such as MIT.

## Contact

For more information, please visit [Bharat](https://Bharat.com/).
