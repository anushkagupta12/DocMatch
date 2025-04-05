from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity as cosine_sim
from collections import Counter
import Levenshtein

def cosine_similarity(text1, text2):
    vect = CountVectorizer().fit_transform([text1, text2])
    return float(cosine_sim(vect[0], vect[1])[0][0])

def word_freq_similarity(text1, text2):
    counter1 = Counter(text1.split())
    counter2 = Counter(text2.split())
    common = sum((counter1 & counter2).values())
    total = sum((counter1 | counter2).values())
    return common / total if total else 0

def levenshtein_sim(text1, text2):
    return 1 - Levenshtein.distance(text1, text2) / max(len(text1), len(text2))
