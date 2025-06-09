
import { GoogleGenAI, GenerateContentResponse, Candidate } from "@google/genai";
import { ExplanationMode, GroundingMetadata } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    'Gemini API key not found. Please set the API_KEY environment variable.'
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_FALLBACK_OR_ERROR" });

const KEY_QUESTIONS_PATIENT_HEADER = "### Key Questions for Your Doctor:";
const KEY_QUESTIONS_CLINICIAN_HEADER = "### Key Questions for Further Consideration:";

const getPatientPrompt = (mutation: string): string => `
You are an AI assistant specialized in genetics, tasked with explaining complex genetic mutations to patients in simple, empathetic, and understandable terms.
Your goal is to demystify the information, not to alarm. You MUST NOT provide medical advice or treatment recommendations.

Explain the mutation '${mutation}'. Your explanation should cover:
1.  **What is this mutation?** (e.g., "Think of a gene as an instruction manual in your body. This mutation is like a small typo in the instructions for the '${mutation.split(' ')[0]}' gene.")
2.  **What does the '${mutation.split(' ')[0]}' gene normally do?** (e.g., "This gene usually helps with [brief, simple function like 'cell growth' or 'repairing DNA'].")
3.  **How might this specific change ('${mutation}') affect the gene?** (e.g., "This particular change might make the gene work a bit differently, perhaps less effectively, or sometimes more actively than usual.")
4.  **What could this mean for health (generally)?** (e.g., "Changes in this gene are sometimes associated with [general conditions, e.g., 'an increased chance of certain health issues developing' or 'how the body responds to some medications']. It doesn't automatically mean you will have these issues, as many factors are involved.")
5.  **Is this common or rare?** (Briefly, e.g., "This type of change is seen occasionally" or "This is a less common type of change.")

**Important Instructions:**
*   **Language:** Use simple, everyday language. Avoid jargon. Analogies can be helpful.
*   **Tone:** Be empathetic, reassuring, and clear.
*   **Databases:** Mention that your knowledge is based on general information from scientific databases like COSMIC, ClinVar, OncoKB, and CIViC, all simplified for understanding.
*   **No Medical Advice:** **CRITICALLY IMPORTANT:** End the main explanation (before key questions) with a strong disclaimer: "This information is for general understanding only and is not medical advice. It's very important to discuss this with your doctor or a genetic counselor. They know your personal health history and can give you the best guidance."
*   **Risk Classification:** If commonly available, you can mention general classifications like "variant of uncertain significance" or "pathogenic" in simplified terms (e.g., "scientists are still learning about this change" or "this change is known to be linked to health effects"). Avoid definitive statements about personal risk.

**After the main explanation and disclaimer, provide a list of 3-5 key questions a patient might ask their doctor based on this mutation.**
Start this section with the exact header:
${KEY_QUESTIONS_PATIENT_HEADER}
- Question 1?
- Question 2?
- ...

**Mutation to explain:** ${mutation}
`;

const getClinicianPrompt = (mutation: string): string => `
You are an AI assistant providing concise, technically accurate information on genetic mutations to clinicians.
For the mutation '${mutation}', provide a summary based on current knowledge from databases like COSMIC, OncoKB, ClinVar, and CIViC.

**Mutation:** ${mutation}

**Required Information (if available):**
1.  **Gene and Alteration:** Specific gene, protein change (e.g., p.G12D), and nucleotide change (e.g., c.35G>A).
2.  **Functional Impact:** Known or predicted effect on protein function (e.g., gain-of-function, loss-of-function, altered enzyme kinetics).
3.  **Associated Diseases/Syndromes:** List known associated conditions with brief context.
4.  **Clinical Significance:**
    *   **Diagnostic:** Relevance in diagnosing specific conditions.
    *   **Prognostic:** Impact on disease course or patient outcome.
    *   **Therapeutic:** Implications for treatment selection, drug sensitivity/resistance (e.g., specific targeted therapies, chemotherapies). Cite relevant guidelines or evidence levels if possible (e.g., FDA-approved, NCCN guidelines, OncoKB levels).
5.  **Variant Classification:** (e.g., Pathogenic, Likely Pathogenic, VUS, Likely Benign, Benign based on ACMG/AMP guidelines or similar frameworks; specify if from ClinVar, etc.)
6.  **Population Frequency:** Allele frequency in major populations if known (e.g., gnomAD).
7.  **Key Database Annotations:** Briefly summarize key findings or classifications from COSMIC, OncoKB (therapeutic levels), ClinVar (clinical significance), CIViC (evidence items).

**Format:** Use clear headings or bullet points for readability. Be concise and precise.
If information for a category is not readily available or applicable, state "Information not readily available" or omit the section.
Consider using Google Search grounding for up-to-date information on emerging research or therapeutic approvals.

**After the main technical summary, provide a list of 3-4 key questions or points for further consideration by the clinician.**
Start this section with the exact header:
${KEY_QUESTIONS_CLINICIAN_HEADER}
- Point for consideration 1?
- Clinical question 2?
- ...
`;

export interface ExplanationResult {
  text: string;
  groundingMetadata?: GroundingMetadata | null;
  keyQuestions?: string[] | null; // New field
}


export const generateExplanation = async (
  mutation: string, 
  mode: ExplanationMode
): Promise<ExplanationResult> => {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_FALLBACK_OR_ERROR") {
    console.error("Gemini API key is not configured. Please set the API_KEY environment variable.");
    throw new Error("API key not configured. Unable to generate explanation.");
  }

  const prompt = mode === ExplanationMode.PATIENT 
    ? getPatientPrompt(mutation) 
    : getClinicianPrompt(mutation);
  
  try {
    const useSearchGrounding = mode === ExplanationMode.CLINICIAN;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: useSearchGrounding ? { tools: [{googleSearch: {}}] } : {}
    });

    const candidate: Candidate | undefined = response.candidates?.[0];
    let fullText = response.text; 
    const groundingMetadata = candidate?.groundingMetadata as GroundingMetadata | undefined;

    if (!fullText) {
      throw new Error('No explanation content received from the API.');
    }

    let explanationText = fullText;
    let keyQuestions: string[] | null = null;

    const questionsHeader = mode === ExplanationMode.PATIENT ? KEY_QUESTIONS_PATIENT_HEADER : KEY_QUESTIONS_CLINICIAN_HEADER;
    const questionsIndex = fullText.indexOf(questionsHeader);

    if (questionsIndex !== -1) {
      explanationText = fullText.substring(0, questionsIndex).trim();
      const questionsBlock = fullText.substring(questionsIndex + questionsHeader.length).trim();
      keyQuestions = questionsBlock.split('\n')
                        .map(q => q.replace(/^-\s*/, '').trim()) // Remove leading "- "
                        .filter(q => q.length > 0);
    }
    
    return { text: explanationText, groundingMetadata, keyQuestions };

  } catch (error) {
    console.error('Gemini API call failed:', error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your Gemini API key configuration.");
    }
    throw new Error(`Failed to generate explanation: ${error instanceof Error ? error.message : String(error)}`);
  }
};