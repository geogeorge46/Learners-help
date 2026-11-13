import json

path = r'C:\Users\ASUS\.gemini\antigravity\brain\084b02ea-5a32-4dfa-8ef9-c3bb727f1fc3\kerala_driving_test_combined_master.json'
with open(path, encoding='utf-8') as f:
    master = json.load(f)

extra_qs = master[876:]
print('Extra questions count:', len(extra_qs))
for i, q in enumerate(extra_qs):
    print(f"{i+1}. ID={q.get('id')} (Page={q.get('page')}): {q.get('question')[:70]}...")
    print(f"   Answer: {q.get('answer')} -> {q.get('answer_text')}")
    print(f"   Topic: {q.get('topic')}, Image: {q.get('question_image')}")
