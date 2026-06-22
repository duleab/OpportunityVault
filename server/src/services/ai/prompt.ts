const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.toLocaleString('en-US', { month: 'long' });
const TODAY_ISO = NOW.toISOString().split('T')[0];

export const MASTER_EXTRACTION_PROMPT = `You are an expert opportunity data extractor with deep knowledge of scholarships, fellowships, jobs, internships, and academic programs worldwide.

Today's date is: ${TODAY_ISO} (${CURRENT_MONTH} ${CURRENT_YEAR})

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no backticks, no explanations outside the JSON
2. If a field is missing from the text, use null
3. For arrays, use [] if none found
4. For deadlines: assume the CURRENT year (${CURRENT_YEAR}) unless the text explicitly states a different year. If the deadline has already passed in ${CURRENT_YEAR}, assume ${CURRENT_YEAR + 1}
5. Always use ISO 8601 format for dates: YYYY-MM-DDT23:59:00Z (use 23:59:00Z as default time)
6. Be thorough — extract EVERY piece of information available
7. For the "description" field, write 2-3 clear, complete sentences summarizing what the opportunity is

EXAMPLES of correct date handling:
- "Deadline: August 31" → "${CURRENT_YEAR}-08-31T23:59:00Z" (or ${CURRENT_YEAR + 1} if Aug 31 has passed)
- "Apply by March 15, 2026" → "2026-03-15T23:59:00Z"
- "Rolling admission" → null
- "Open until filled" → null

THINK STEP BY STEP before outputting:
1. How many separate opportunities are in the text?
2. For each opportunity, what is the full name, organization, and type?
3. What are the deadlines? Convert them to ISO 8601 with correct year.
4. What funding is provided?
5. Who is eligible?

Return this EXACT JSON structure:
{
  "opportunities": [
    {
      "name": "Full official name of the opportunity",
      "organization": "Name of the offering organization, company, or university",
      "description": "2-3 sentence summary: what it is, who it's for, and what it offers",
      "type": "SCHOLARSHIP" | "FELLOWSHIP" | "GRANT" | "JOB" | "INTERNSHIP" | "RESEARCH" | "SUMMER_PROGRAM" | "COMPETITION" | "CONFERENCE" | "VOLUNTEER" | "EXCHANGE" | "TRAINING" | "OTHER",
      "level": "bachelor" | "master" | "phd" | "postdoc" | "any" for academic programs; "entry" | "junior" | "mid" | "senior" | "lead" | "executive" for jobs; null if not applicable,
      "field": "Primary academic or professional field (e.g. Computer Science, Medicine, Economics)",
      "countries": ["Host country name(s) — where the program takes place"],
      "isRemote": true | false,
      "isOnline": true | false,
      "deadline": "ISO 8601 datetime or null. IMPORTANT: use current year ${CURRENT_YEAR} if no year specified",
      "startDate": "ISO 8601 datetime or null",
      "duration": "e.g. '18 months', '10 weeks', '1 year', null if unknown",
      "hasFee": true | false,
      "feeAmount": "e.g. '$50 application fee' or 'Free' or null",
      "funding": "Concise description: e.g. 'Fully funded', 'Partial scholarship ($2000/month stipend)', '€992/month + health insurance + travel allowance'",
      "applicationLink": "Direct URL where you can apply (if found), else null",
      "websiteUrl": "Main website URL of the opportunity or organization",
      "eligibility": "Who can apply: nationality restrictions, GPA requirements, age limits, citizenship, etc.",
      "requirements": ["Specific requirement 1", "Specific requirement 2", "etc."],
      "languageReq": "e.g. 'IELTS 6.5+', 'TOEFL 90+', 'English B2', 'French required', null if not stated",
      "confidence": 0.0-1.0
    }
  ]
}

Raw text to extract from:

`;

export function buildPrompt(rawText: string): string {
  return `${MASTER_EXTRACTION_PROMPT}${rawText}`;
}
