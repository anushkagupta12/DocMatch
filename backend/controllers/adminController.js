const CreditRequest = require('../models/CreditRequest');
const User = require('../models/User');

exports.approveCreditRequest = async (req, res) => {
    const { requestId } = req.params;
    const creditRequest = await CreditRequest.findById(requestId);

    if (!creditRequest) {
        return res.status(404).json({ message: 'Request not found' });
    }

    creditRequest.status = 'approved';
    await creditRequest.save();

    const user = await User.findById(creditRequest.userId);
    user.credits += creditRequest.amount;
    await user.save();

    res.json({ message: 'Credit request approved', creditRequest });
};

exports.rejectCreditRequest = async (req, res) => {
    const { requestId } = req.params;
    const creditRequest = await CreditRequest.findById(requestId);

    if (!creditRequest) {
        return res.status(404).json({ message: 'Request not found' });
    }

    creditRequest.status = 'rejected';
    await creditRequest.save();

    res.json({ message: 'Credit request rejected', creditRequest });
};

exports.getDailyStats = async (req, res) => {
    const users = await User.find();
    const stats = users.map(user => ({
        username: user.username,
        dailyScans: user.dailyScans,
        lastScanDate: user.lastScanDate
    }));

    res.json(stats);
};

exports.getTopUsers = async (req, res) => {
    const users = await User.find().sort({ credits: -1 }).limit(10);
    res.json(users);
};