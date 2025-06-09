
import React from 'react';

const generalResources = [
  { name: "MedlinePlus Genetics (National Library of Medicine)", url: "https://medlineplus.gov/genetics/" },
  { name: "National Human Genome Research Institute (NHGRI)", url: "https://www.genome.gov/" },
  { name: "COSMIC - Catalogue Of Somatic Mutations In Cancer", url: "https://cancer.sanger.ac.uk/cosmic/"},
  { name: "ClinVar (NCBI)", url: "https://www.ncbi.nlm.nih.gov/clinvar/"},
  { name: "OncoKB - Precision Oncology Knowledge Base", url: "https://www.oncokb.org/"},
  { name: "CIViC - Clinical Interpretations of Variants in Cancer", url: "https://civicdb.org/"}
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 py-8 text-slate-400 text-sm border-t border-slate-700">
      <div className="container mx-auto px-4 max-w-3xl divide-y divide-slate-700">
        <div className="py-6">
          <h3 className="text-base font-semibold text-slate-300 mb-3">General Genetics Resources</h3>
          <ul className="space-y-2">
            {generalResources.map(resource => (
              <li key={resource.name}>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 hover:underline transition-colors duration-150"
                  aria-label={`Learn more at ${resource.name} (opens in new tab)`}
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="py-6">
          <p className="mb-2">
            Information is synthesized by AI based on publicly available data from sources like COSMIC, OncoKB, ClinVar, CIViC, and other biomedical literature.
          </p>
          <p className="font-semibold text-amber-400">
            Disclaimer: This tool is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="mt-4">
            &copy; {new Date().getFullYear()} BioInCRO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
