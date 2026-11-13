import json

with open(r'c:\Users\ASUS\Downloads\leaners test\questions.json', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    if q.get('number') in [692, 726, 757]:
        print(f"Q{q.get('number')} (id={q.get('id')}):")
        print(q.get('question'))
        for opt in q.get('options'):
            print(f"  {opt.get('key')}: {opt.get('text')}")
        print(f"Answer: {q.get('answer')} -> {q.get('answer_text')}")
        print("-" * 50)
