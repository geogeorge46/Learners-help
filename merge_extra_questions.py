import json
import zipfile
import os

# Load current 877 questions
current_json_path = r'c:\Users\ASUS\Downloads\leaners test\questions.json'
with open(current_json_path, encoding='utf-8') as f:
    current_questions = json.load(f)

print(f"Current questions: {len(current_questions)}")

# Load combined master
master_json_path = r'C:\Users\ASUS\.gemini\antigravity\brain\084b02ea-5a32-4dfa-8ef9-c3bb727f1fc3\kerala_driving_test_combined_master.json'
with open(master_json_path, encoding='utf-8') as f:
    master_questions = json.load(f)

print(f"Master questions: {len(master_questions)}")

# Extra questions start at index 876
extra_raw = master_questions[876:]
print(f"Extra questions to add: {len(extra_raw)}")

# Standardize topics
def normalize_topic(t):
    if not t:
        return "Driving Rules & Regulations"
    if "Sign" in t or "Signal" in t:
        return "Road Signs & Traffic Signals"
    if "Penalt" in t or "Fine" in t or "Offense" in t:
        return "Penalties, Fines & Offenses"
    if "Safety" in t or "First Aid" in t:
        return "Road Safety & First Aid"
    if "Licens" in t or "Document" in t:
        return "Licensing & Documentation"
    return "Driving Rules & Regulations"

new_extra = []
next_id = len(current_questions) + 1 # 878
for idx, q in enumerate(extra_raw):
    new_q = {
        "id": next_id + idx,
        "number": 876 + idx + 1,
        "question": q["question"].strip(),
        "question_image": q.get("question_image"),
        "options": q["options"],
        "answer": q["answer"],
        "answer_text": q.get("answer_text"),
        "explanation": q.get("explanation"),
        "explanation_image": q.get("explanation_image"),
        "subject": "Kerala MVD Learner's Licence Test",
        "topic": normalize_topic(q.get("topic")),
        "page": q.get("page")
    }
    new_extra.append(new_q)

# Combined dataset
combined_all = current_questions + new_extra
print(f"New combined total: {len(combined_all)}")

# Save to c:\Users\ASUS\Downloads\leaners test\questions.json
with open(current_json_path, 'w', encoding='utf-8') as f:
    json.dump(combined_all, f, ensure_ascii=False, indent=2)

# Save to public\questions.json
app_json_path = r'c:\Users\ASUS\Downloads\leaners test\sarathi-test-app\public\questions.json'
with open(app_json_path, 'w', encoding='utf-8') as f:
    json.dump(combined_all, f, ensure_ascii=False, indent=2)

# Also update in dist\questions.json if dist exists
dist_json_path = r'c:\Users\ASUS\Downloads\leaners test\sarathi-test-app\dist\questions.json'
if os.path.exists(dist_json_path):
    with open(dist_json_path, 'w', encoding='utf-8') as f:
        json.dump(combined_all, f, ensure_ascii=False, indent=2)

# Update zip archive
zip_path = r'c:\Users\ASUS\Downloads\leaners test\learners_question_bank_corrected.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write(current_json_path, 'questions.json')
    zipf.write(r'c:\Users\ASUS\Downloads\leaners test\README.md', 'README.md')
    img_dir = r'c:\Users\ASUS\Downloads\leaners test\images'
    for root, dirs, files in os.walk(img_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, r'c:\Users\ASUS\Downloads\leaners test')
            zipf.write(full_path, arcname)

print("Updated questions.json, public/questions.json, and zip archive successfully!")
