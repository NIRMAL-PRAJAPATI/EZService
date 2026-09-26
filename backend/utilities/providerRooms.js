// Keeps a provider's open sockets in the right Instant Service rooms.
// Rooms are "service-<categoryId>"; a provider is in a room only when they are
// online AND have an active service in that category switched on for Instant.
const Service = require('../models/service');
const ProviderInfo = require('../models/providerInfo');

module.exports = async (io, providerId) => {
    if (!io) return;
    const [provider, services] = await Promise.all([
        ProviderInfo.findByPk(providerId, { attributes: ['id', 'is_online'] }),
        Service.findAll({ where: { provider_id: providerId }, attributes: ['category_id', 'is_active', 'instant_enabled'] })
    ]);
    const all = [...new Set(services.map(s => s.category_id).filter(id => id != null))].map(id => `service-${id}`);
    const allowed = [...new Set(
        services.filter(s => s.is_active !== false && s.instant_enabled !== false).map(s => s.category_id).filter(id => id != null)
    )].map(id => `service-${id}`);

    const sockets = io.in(`provider-${providerId}`);
    if (all.length) sockets.socketsLeave(all);
    if (provider?.is_online && allowed.length) sockets.socketsJoin(allowed);
};
