const Document = require('../models/Document');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { calculateCosineSimilarity } = require('../utils/cosineSimilarity');

exports.uploadDocument = async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated and user ID is available
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const content = fs.readFileSync(file.path, 'utf-8');
    const document = new Document({ userId, filename: file.filename, content });
    await document.save();

    res.status(201).json({ message: 'Document uploaded successfully', document });
};

exports.matchDocuments = async (req, res) => {
    const { referenceId, targetIds } = req.body;
    const referenceDoc = await Document.findById(referenceId);
    const targetDocs = await Document.find({ _id: { $in: targetIds } });

    if (!referenceDoc || targetDocs.length === 0) {
        return res.status(400).json({ message: 'Invalid document IDs' });
    }

    const results = targetDocs.map(doc => ({
        filename: doc.filename,
        similarity: calculateCosineSimilarity(referenceDoc.content, doc.content)
    }));

    res.json(results);
};

exports.compareDocuments = async (req, res) => {
    try {
        const { file1, file2 } = req.files;
        
        if (!file1 || !file2) {
            return res.status(400).json({ message: 'Please upload both files' });
        }

        const content1 = fs.readFileSync(file1[0].path, 'utf-8');
        const content2 = fs.readFileSync(file2[0].path, 'utf-8');

        // Clean up uploaded files
        fs.unlinkSync(file1[0].path);
        fs.unlinkSync(file2[0].path);

        const similarity = calculateCosineSimilarity(content1, content2);
        
        res.json({ 
            similarity,
            message: 'Documents compared successfully'
        });
    } catch (error) {
        console.error('Error comparing documents:', error);
        res.status(500).json({ message: 'Error comparing documents' });
    }
};
