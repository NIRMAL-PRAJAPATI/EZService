// One job at a time: while a provider is on a trip (on the way or at the
// customer's place) they can't take new work, and Instant Service stays off.
const Order = require('../models/order');
const ProviderInfo = require('../models/providerInfo');
const syncProviderRooms = require('./providerRooms');

// Is the provider already on a job (on the way or at a location)?
const hasRunningTrip = async (providerId, exceptOrderId) => {
    const running = await Order.findOne({
        where: { provider_id: providerId, status: 'CONFIRMED', trip_status: ['ON_THE_WAY', 'ARRIVED'] },
        attributes: ['order_id']
    });
    return !!running && running.order_id !== exceptOrderId;
};

// Switch Instant Service off for a provider who is on a trip, and tell their open pages.
const goOfflineForTrip = async (io, providerId) => {
    const provider = await ProviderInfo.findByPk(providerId, { attributes: ['id', 'is_online'] });
    if (!provider?.is_online) return false;
    await provider.update({ is_online: false });
    await syncProviderRooms(io, providerId);
    io?.to(`provider-${providerId}`).emit('onlineStatus', { isOnline: false, reason: 'TRIP_RUNNING' });
    return true;
};

module.exports = { hasRunningTrip, goOfflineForTrip };
