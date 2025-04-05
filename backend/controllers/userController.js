const User = require('../models/User');
const CreditRequest = require('../models/CreditRequest');

exports.requestCredits = async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const { amount } = req.body;

    const creditRequest = new CreditRequest({ userId, amount });
    await creditRequest.save();

    res.status(201).json({ message: 'Credit request submitted', creditRequest });
};

exports.checkCredits = async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const user = await User.findById(userId);
    res.json({ credits: user.credits });
};