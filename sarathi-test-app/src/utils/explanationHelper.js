// Explanation Helper Utility for Learning Mode & Review

export function getQuestionExplanation(q) {
  if (!q) return '';
  if (q.explanation && q.explanation.trim()) {
    return q.explanation;
  }
  
  // Topic or type specific smart fallbacks
  if (q.question_image || (q.topic && q.topic.includes('Sign'))) {
    if (q.answer_text) {
      return `ഈ ട്രാഫിക് ചിഹ്നം സൂചിപ്പിക്കുന്നത് "${q.answer_text}" എന്നാണ്. മോട്ടോർ വാഹന ചട്ടങ്ങൾ പ്രകാരം ഡ്രൈവർമാർ ഇത്തരം സൂചനാ ബോർഡുകൾ നിർബന്ധമായും ശ്രദ്ധിക്കുകയും പാലിക്കുകയും ചെയ്യേണ്ടതാണ്.`;
    }
    return `ചോദ്യത്തിൽ കാണിച്ചിരിക്കുന്ന ചിഹ്നം റോഡ് സുരക്ഷാ ചട്ടപ്രകാരം നിർബന്ധമായും പാലിക്കേണ്ട പ്രധാന ട്രാഫിക് അടയാളമാണ്.`;
  }

  if (q.options && q.options.some(o => o.image)) {
    return `ചോദ്യത്തിൽ ചോദിച്ചിട്ടുള്ള ട്രാഫിക് ചിഹ്നം ഓപ്ഷൻ ${q.answer} ആണ്. റോഡ് സുരക്ഷാ നിയമപ്രകാരം ഡ്രൈവർമാർ ഇത് കൃത്യമായി തിരിച്ചറിഞ്ഞ് വാഹനം നിയന്ത്രിക്കേണ്ടതാണ്.`;
  }

  if (q.topic && (q.topic.includes('Penalt') || q.topic.includes('Fine'))) {
    return `റോഡ് സുരക്ഷ ഉറപ്പാക്കുന്നതിനും ഗതാഗത നിയമലംഘനങ്ങൾ തടയുന്നതിനും മോട്ടോർ വെഹിക്കിൾ ആക്ട് (MV Act) പ്രകാരം ഇത്തരം കുറ്റങ്ങൾക്ക് കർശനമായ പിഴയോ ശിക്ഷയോ വ്യവസ്ഥ ചെയ്തിട്ടുണ്ട്.`;
  }

  if (q.topic && q.topic.includes('Safety')) {
    return `റോഡപകടങ്ങൾ ലഘൂകരിക്കുന്നതിനും മനുഷ്യജീവൻ രക്ഷിക്കുന്നതിനും പ്രഥമശുശ്രൂഷാ ചട്ടങ്ങൾ അനുസരിച്ച് ഈ നിർദ്ദേശം കൃത്യമായി പാലിക്കേണ്ടതാണ്.`;
  }

  if (q.answer_text) {
    return `കേരള മോട്ടോർ വാഹന ചട്ടങ്ങൾ (MVD Regulations) പ്രകാരം ഈ ചോദ്യത്തിന്റെ ശരിയായ നിയമപരമായ ഉത്തരം "${q.answer_text}" എന്നതാണ്.`;
  }

  return `റോഡ് സുരക്ഷ ഉറപ്പാക്കാൻ മോട്ടോർ വാഹന നിയമങ്ങൾ അനുസരിച്ച് ഡ്രൈവർമാർ ഈ നിർദ്ദേശം കൃത്യമായി പാലിക്കേണ്ടതാണ്.`;
}
