import json

with open(r'c:\Users\ASUS\Downloads\leaners test\questions.json', encoding='utf-8') as f:
    zip_data = json.load(f)

with open(r'C:\Users\ASUS\.gemini\antigravity\brain\084b02ea-5a32-4dfa-8ef9-c3bb727f1fc3\kerala_driving_test_app_format.json', encoding='utf-8') as f:
    old_data = json.load(f)

print(f"Zip data count: {len(zip_data)}")
print(f"Old data count: {len(old_data)}")

# Map old data by ID
old_map = {q['id']: q for q in old_data}

# Compare answers
answer_diffs = []
for q in zip_data:
    qid = q['id']
    # If id > 660, old_data id is offset by 1 because of duplicate 660
    old_q = None
    if qid <= 660:
        old_q = old_map.get(qid)
    elif qid == 661:
        # this is the second 660
        old_q = None
    else:
        old_q = old_map.get(qid - 1)
        
    if old_q:
        if q['answer'] != old_q['answer']:
            answer_diffs.append((qid, q.get('number'), q['answer'], old_q['answer'], q['question'][:30]))

print(f"Answer differences count: {len(answer_diffs)}")
for d in answer_diffs:
    print(d)
