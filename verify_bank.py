import json
import os

with open(r'c:\Users\ASUS\Downloads\leaners test\questions.json', encoding='utf-8') as f:
    questions = json.load(f)

print('Loaded questions:', len(questions))

anomalies = []

for q in questions:
    qid = q['id']
    qnum = q.get('number')
    opts = q.get('options', [])
    
    # 1. Option count
    if len(opts) != 4:
        anomalies.append((qid, qnum, f'Option count is {len(opts)}'))
        
    # 2. Check keys
    keys = [o.get('key') for o in opts]
    if keys != ['A', 'B', 'C', 'D']:
        anomalies.append((qid, qnum, f'Option keys: {keys}'))
        
    # 3. Check option content
    for o in opts:
        if not o.get('text') and not o.get('image'):
            anomalies.append((qid, qnum, f"Option {o.get('key')} has neither text nor image"))
            
    # 4. Check answer key
    ans = q.get('answer')
    if ans not in ['A', 'B', 'C', 'D']:
        anomalies.append((qid, qnum, f'Invalid answer key: {ans}'))
        
    # 5. Check answer_text consistency
    matching_opt = next((o for o in opts if o.get('key') == ans), None)
    if matching_opt:
        if matching_opt.get('text') and q.get('answer_text') != matching_opt.get('text'):
            anomalies.append((qid, qnum, f"answer_text mismatch: ans={ans}, q.answer_text='{q.get('answer_text')}', opt.text='{matching_opt.get('text')}'"))
        if matching_opt.get('image') and q.get('answer_text') is not None:
            anomalies.append((qid, qnum, f"Image option has non-null answer_text: {q.get('answer_text')}"))
            
    # 6. Check question text
    qtext = q.get('question', '').strip()
    if not qtext:
        anomalies.append((qid, qnum, 'Empty question text'))
    elif len(qtext) < 5:
        anomalies.append((qid, qnum, f"Very short question text: '{qtext}'"))
        
    # 7. Check for dotted circles (U+25CC)
    if '\u25cc' in qtext:
        anomalies.append((qid, qnum, f'Dotted circle in question text'))
    for o in opts:
        if o.get('text') and '\u25cc' in o.get('text'):
            anomalies.append((qid, qnum, f"Dotted circle in option {o.get('key')}: {o.get('text')[:30]}"))

print(f'Total anomalies found: {len(anomalies)}')
for a in anomalies:
    print(a)
