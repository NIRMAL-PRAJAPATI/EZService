// Small, idempotent schema updates that sequelize.sync() does not do on its own
// (sync only creates missing tables, it never adds columns to existing ones).
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const addColumnIfMissing = async (table, column, definition) => {
    const qi = sequelize.getQueryInterface();
    const description = await qi.describeTable(table);
    if (!description[column]) {
        await qi.addColumn(table, column, definition);
        console.log(`Migration: added ${table}.${column}`);
    }
};

// IFSC codes are letters + digits (e.g. SBIN0001234), so the column must be text
const makeTextIfNumeric = async (table, column) => {
    const qi = sequelize.getQueryInterface();
    const description = await qi.describeTable(table);
    const type = description[column]?.type || '';
    if (/INT|NUMERIC/i.test(type)) {
        await qi.changeColumn(table, column, { type: DataTypes.STRING, allowNull: true });
        console.log(`Migration: ${table}.${column} is now text`);
    }
};

module.exports = async () => {
    try {
        // Live trip tracking for confirmed orders: null -> ON_THE_WAY -> ARRIVED
        await addColumnIfMissing('order', 'trip_status', { type: DataTypes.STRING, allowNull: true });
        await addColumnIfMissing('order', 'trip_updated', { type: DataTypes.DATE, allowNull: true });
        await addColumnIfMissing('order', 'trip_pin', { type: DataTypes.STRING, allowNull: true });
        // Service switches: existing services stay visible and in Instant Service
        await addColumnIfMissing('service', 'is_active', { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true });
        // Live locations for Instant Service (distance between customer and provider)
        // Service location for instant orders = customer's live location
        await addColumnIfMissing('order', 'lat', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('order', 'lng', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('service_request', 'lat', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('service_request', 'lng', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('provider_info', 'last_lat', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('provider_info', 'last_lng', { type: DataTypes.DOUBLE, allowNull: true });
        await addColumnIfMissing('provider_info', 'location_updated', { type: DataTypes.DATE, allowNull: true });
        await addColumnIfMissing('service', 'instant_enabled', { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true });
        // Payment collected when the provider completes a service
        await addColumnIfMissing('order', 'payment_mode', { type: DataTypes.STRING, allowNull: true });
        await addColumnIfMissing('order', 'payment_status', { type: DataTypes.STRING, allowNull: true });
        await addColumnIfMissing('order', 'payment_ref', { type: DataTypes.STRING, allowNull: true });
        await addColumnIfMissing('order', 'paid_at', { type: DataTypes.DATE, allowNull: true });
        await addColumnIfMissing('provider_bank', 'upi_id', { type: DataTypes.STRING, allowNull: true });
        await makeTextIfNumeric('provider_bank', 'ifsc_code');
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
};
