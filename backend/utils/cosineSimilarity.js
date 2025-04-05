const calculateCosineSimilarity = (text1, text2) => {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');

    const wordSet = new Set([...words1, ...words2]);
    const vector1 = Array.from(wordSet).map(word => words1.filter(w => w === word).length);
    const vector2 = Array.from(wordSet).map(word => words2.filter(w => w === word).length);

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitude1 * magnitude2);
};

module.exports = { calculateCosineSimilarity };