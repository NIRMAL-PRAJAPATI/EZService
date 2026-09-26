const ExplorePost = require('../models/explorePost');
const CustomerInfo = require('../models/customerInfo');
const ProviderInfo = require('../models/providerInfo');

const getPosts = async (req, res) => {
  try {
    const { limit, offset } = req.pagination;
    const { type } = req.query;

    const where = {};
    if (type === 'comment' || type === 'complaint') {
      where.type = type;
    }

    const posts = await ExplorePost.findAll({
      where,
      limit,
      offset,
      order: [['created', 'DESC']],
      include: [
        { model: CustomerInfo, attributes: ['id', 'name'] },
        { model: ProviderInfo, attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json(posts);
  } catch (e) {
    console.error('Error fetching explore posts:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { userId, role } = req;

    if (role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can post comments or complaints' });
    }

    const { type, provider_id, message, subject, rating } = req.body;
    let { hashtags } = req.body;

    if (!['comment', 'complaint'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type' });
    }

    if (!provider_id) {
      return res.status(400).json({ message: 'Please select a provider' });
    }

    if (!message || message.trim().length < 5) {
      return res.status(400).json({ message: 'Message must be at least 5 characters' });
    }

    const provider = await ProviderInfo.findByPk(provider_id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    if (typeof hashtags === 'string') {
      try {
        hashtags = JSON.parse(hashtags);
      } catch {
        hashtags = [];
      }
    }

    const post = await ExplorePost.create({
      customer_id: userId,
      provider_id,
      type,
      subject: type === 'complaint' ? (subject || null) : null,
      message: message.trim(),
      hashtags: type === 'comment' && Array.isArray(hashtags) ? hashtags : null,
      rating: type === 'comment' && rating ? parseInt(rating) : null,
      image: req.file ? `/uploads/explore/${req.file.filename}` : null,
      created: new Date()
    });

    const fullPost = await ExplorePost.findByPk(post.id, {
      include: [
        { model: CustomerInfo, attributes: ['id', 'name'] },
        { model: ProviderInfo, attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(fullPost);
  } catch (e) {
    console.error('Error creating explore post:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getPosts, createPost };
