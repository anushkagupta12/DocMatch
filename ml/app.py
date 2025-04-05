import os
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import Levenshtein as lev

# Download NLTK resources
nltk.download('stopwords')

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class DocumentMatcher:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.stemmer = PorterStemmer()

    def preprocess(self, text):
        text = text.lower()
        tokens = text.split()
        tokens = [self.stemmer.stem(word) for word in tokens if word not in self.stop_words]
        return ' '.join(tokens)

    def word_frequency_comparison(self, ref_doc, target_docs):
        ref_freq = Counter(ref_doc.split())
        results = {}
        for target in target_docs:
            target_freq = Counter(target.split())
            intersection = ref_freq & target_freq
            score = sum(intersection.values())
            results[target] = score
        return results

    def cosine_similarity(self, ref_doc, target_docs):
        documents = [ref_doc] + target_docs
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(documents)
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        return {target_docs[i]: cosine_similarities[i] for i in range(len(target_docs))}

    def levenshtein_distance(self, ref_doc, target_docs):
        results = {}
        for target in target_docs:
            distance = lev.distance(ref_doc, target)
            results[target] = distance
        return results

    def match_documents(self, ref_doc, target_docs):
        ref_doc_processed = self.preprocess(ref_doc)
        target_docs_processed = [self.preprocess(doc) for doc in target_docs]

        word_freq_results = self.word_frequency_comparison(ref_doc_processed, target_docs_processed)
        cosine_results = self.cosine_similarity(ref_doc_processed, target_docs_processed)
        levenshtein_results = self.levenshtein_distance(ref_doc, target_docs)

        combined_results = {}
        for target in target_docs:
            combined_results[target] = {
                'word_frequency_score': word_freq_results[target],
                'cosine_similarity_score': cosine_results[target],
                'levenshtein_distance': levenshtein_results[target]
            }

        return combined_results

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'reference_file' not in request.files or 'target_files' not in request.files:
        return jsonify({"error": "Reference file and target files are required."}), 400

    reference_file = request.files['reference_file']
    target_files = request.files.getlist('target_files')

    # Save the reference file
    ref_file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(reference_file.filename))
    reference_file.save(ref_file_path)

    # Read the reference document
    with open(ref_file_path, 'r') as f:
        reference_document = f.read()

    # Read target documents
    target_documents = []
    for target_file in target_files:
        target_file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(target_file.filename))
        target_file.save(target_file_path)
        with open(target_file_path, 'r') as f:
            target_documents.append(f.read())

    # Perform document matching
    matcher = DocumentMatcher()
    results = matcher.match_documents(reference_document, target_documents)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)