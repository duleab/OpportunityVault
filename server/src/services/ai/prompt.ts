export const MASTER_EXTRACTION_PROMPT = `You are an expert opportunity data extractor.

The user has pasted raw text from a scholarship, job posting,
internship announcement, fellowship, or any other opportunity.
Extract ALL available information and return ONLY valid JSON.

Do not include markdown backticks or any text outside the JSON.
If a field is not mentioned in the text, use null.
For arrays, use [] if none found.

Be thorough — extract every piece of information available.
Return this exact JSON structure:
{
  "name": "Full name of the opportunity",
  "organization": "Name of offering organization/company/university",
  "description": "2-3 sentence summary of what this opportunity is",
  "type": one of: "SCHOLARSHIP"|"FELLOWSHIP"|"GRANT"|"JOB"|"INTERNSHIP"|"RESEARCH"|"SUMMER_PROGRAM"|"COMPETITION"|"CONFERENCE"|"VOLUNTEER"|"EXCHANGE"|"TRAINING"|"OTHER",
  "level": for scholarships: "bachelor"|"master"|"phd"|"postdoc"|"any" for jobs: "entry"|"junior"|"mid"|"senior"|"lead"|"executive" null if not applicable,
  "field": "Primary field e.g. Computer Science, Medicine, Engineering",
  "countries": ["list", "of", "countries"],
  "isRemote": true|false,
  "isOnline": true|false,
  "deadline": "ISO 8601 date if found e.g. 2025-03-15T23:59:00Z, else null",
  "startDate": "ISO 8601 date if found, else null",
  "duration": "e.g. 6 months, 1 year, null if unknown",
  "hasFee": true|false,
  "feeAmount": "e.g. $50 application fee, Free, null if unclear",
  "funding": "e.g. Fully funded, Partial scholarship, $2000/month stipend",
  "applicationLink": "direct URL for applying, null if not found",
  "websiteUrl": "main website URL of opportunity or organization",
  "eligibility": "who can apply — nationality, age, GPA etc.",
  "requirements": ["list of specific requirements"],
  "languageReq": "e.g. IELTS 6.5, TOEFL 90, English B2, null if not stated",
  "confidence": 0.0-1.0 how confident you are in the extraction
}

Raw text to extract from:

`;

export function buildPrompt(rawText: string): string {
  return `${MASTER_EXTRACTION_PROMPT}${rawText}`;
}
