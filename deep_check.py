import json, os

with open(r'c:\Users\ASUS\Downloads\leaners test\questions.json', encoding='utf-8') as f:
    questions = json.load(f)

img_dir = r'c:\Users\ASUS\Downloads\leaners test\images'

issues = []
ids = set()

for q in questions:
    qid = q.get('id')
    if qid in ids:
        issues.append(f"Duplicate id {qid}")
    ids.add(qid)
    
    qnum = q.get('number')
    if not (1 <= qnum <= 876):
        issues.append(f"Q id={qid} number out of range: {qnum}")
        
    page = q.get('page')
    if not (1 <= page <= 158):
        issues.append(f"Q id={qid} page out of range: {page}")
        
    qi = q.get('question_image')
    if qi:
        p = os.path.join(r'c:\Users\ASUS\Downloads\leaners test', qi.replace('/', os.sep))
        if not os.path.exists(p):
            issues.append(f"Q id={qid} question_image missing: {p}")
            
    opts = q.get('options', [])
    for opt in opts:
        oi = opt.get('image')
        if oi:
            p = os.path.join(r'c:\Users\ASUS\Downloads\leaners test', oi.replace('/', os.sep))
            if not os.path.exists(p):
                issues.append(f"Q id={qid} option image missing: {p}")
        ot = opt.get('text')
        if ot is None and oi is None:
            issues.append(f"Q id={qid} option {opt.get('key')} has both text and image null")

print(f"Total issues found: {len(issues)}")
for i in issues[:20]:
    print(i)
