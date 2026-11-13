import json
import os
import zipfile

json_path = r'c:\Users\ASUS\Downloads\leaners test\questions.json'
with open(json_path, encoding='utf-8') as f:
    questions = json.load(f)

# Fix Q535
q535 = next((q for q in questions if q['id'] == 535), None)
if q535:
    print("Old Q535 options count:", len(q535['options']))
    q535['options'] = [
        {
            "key": "A",
            "text": "ട്രെയിലറിൽ",
            "image": None
        },
        {
            "key": "B",
            "text": "വാഹനത്തിന്റെ ബോഡിയിൽ",
            "image": None
        },
        {
            "key": "C",
            "text": "കൂലിക്കോ പ്രതിഫലത്തിനോ വേണ്ടി",
            "image": None
        },
        {
            "key": "D",
            "text": "യാത്രക്കാരെ കയറ്റാൻ കഴിയില്ല।",
            "image": None
        }
    ]
    q535['answer'] = "D"
    q535['answer_text'] = "യാത്രക്കാരെ കയറ്റാൻ കഴിയില്ല।"
    print("Fixed Q535 options count:", len(q535['options']))
    print("New answer:", q535['answer'], "->", q535['answer_text'])

# Optionally add subject and topic categorization
for q in questions:
    if q.get('subject') is None:
        q['subject'] = "Kerala MVD Learner's Licence Test"
    if q.get('topic') is None:
        if q.get('question_image') or any(o.get('image') for o in q.get('options', [])):
            q['topic'] = "Road Signs & Traffic Signals"
        elif any(k in q.get('question', '') for k in ['പിഴ', 'ശിക്ഷ', 'ജയിൽ', 'രൂപ']):
            q['topic'] = "Penalties, Fines & Offenses"
        else:
            q['topic'] = "Driving Rules & Regulations"

# Save updated questions.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Saved updated questions.json successfully.")

# Create corrected zip archive
corrected_zip_path = r'c:\Users\ASUS\Downloads\leaners test\learners_question_bank_corrected.zip'
with zipfile.ZipFile(corrected_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write(json_path, 'questions.json')
    zipf.write(r'c:\Users\ASUS\Downloads\leaners test\README.md', 'README.md')
    img_dir = r'c:\Users\ASUS\Downloads\leaners test\images'
    for root, dirs, files in os.walk(img_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, r'c:\Users\ASUS\Downloads\leaners test')
            zipf.write(full_path, arcname)

print("Created corrected zip archive at:", corrected_zip_path)
