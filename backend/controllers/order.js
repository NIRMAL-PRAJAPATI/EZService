const CustomerInfo = require("../models/customerInfo");
const Order = require("../models/order");
const ProviderInfo = require("../models/providerInfo");
const Service = require("../models/service");
const ServiceRequest = require("../models/serviceRequest");
const ProviderBank = require("../models/providerBank");
const { hasRunningTrip, goOfflineForTrip } = require("../utilities/runningTrip");

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit, page, offset } = req.pagination;
        const order = await Order.findByPk(id, 
            {
                limit: limit,
                offset: offset,
                order: [['created', 'DESC']],
                include: [
                    {
                        model: Service,
                        attributes: ['name', 'cover_image', 'visiting_charge', 'description','instant_visiting_charge','id'],
                    },
                    {
                        model: CustomerInfo,
                        attributes: ['name', 'email', 'mobile','id'],
                    },
                    {
                        model: ProviderInfo,
                        attributes: ['name', 'email', 'mobile','id','address'],
                    }
                ],
            }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const { limit, page, offset } = req.pagination;
        const orders = await Order.findAll({
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: Service,
                    attributes: ['name', 'cover_image', 'visiting_charge', 'description','instant_visiting_charge','id'],
                },
                {
                    model: CustomerInfo,
                    attributes: ['name', 'email', 'mobile','id'],
                },
                {
                    model: ProviderInfo,
                    attributes: ['name', 'email', 'mobile','id','address'],
                }
            ],
        });

        if (!orders) {
            return res.status(404).json({ message: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOrdersByUserId = async (req, res) => {
    try {
        const id  = req.userId;
        const { limit, page, offset } = req.pagination;
        const orders = await Order.findAll({
            where: { customer_id: id },
            limit: limit,
            offset: offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: Service,
                    attributes: ['name', 'cover_image', 'visiting_charge', 'instant_visiting_charge','id'],
                },
                {
                    model: ProviderInfo,
                    attributes: ['name','id'],
                }
            ],
        });

        if (!orders) {
            return res.status(404).json({ message: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const { userId, role } = req;
        
        // Validate and map status
        const validStatuses = ['accepted', 'rejected', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        
        const statusMap = {
            'accepted': 'CONFIRMED',
            'rejected': 'CANCELLED',
            'CONFIRMED': 'CONFIRMED',
            'CANCELLED': 'CANCELLED',
            'COMPLETED': 'COMPLETED'
        };
        
        const mappedStatus = statusMap[status] || status;
        
        // Providers can update any status on their orders; customers may only cancel their own
        if (role === 'customer') {
            if (mappedStatus !== 'CANCELLED') {
                return res.status(403).json({ message: "Customers can only cancel orders" });
            }
        } else if (role !== 'provider') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Find the order
        const order = await Order.findOne({ 
            where: { 
                order_id: orderId,
                ...(role === 'provider' ? { provider_id: userId } : { customer_id: userId })
            }
        });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found or cannot be updated" });
        }
        
        // Check if order can be updated based on current status
        if (order.status === 'COMPLETED') {
            return res.status(400).json({ message: "Completed orders cannot be updated" });
        }
        if (role === 'customer' && order.status === 'CANCELLED') {
            return res.status(400).json({ message: "Order is already cancelled" });
        }
        if (role === 'customer' && order.trip_status) {
            return res.status(400).json({ message: "The provider is already on the way. Please call them to cancel." });
        }
        
        // Update the order status
        await order.update({ 
            status: mappedStatus,
            updated: new Date()
        });
        notifyOrderUpdate(req, order);
        
        res.status(200).json({ 
            message: `Order ${mappedStatus === 'CONFIRMED' ? 'accepted' : mappedStatus === 'CANCELLED' ? 'declined' : 'updated'} successfully`,
            order
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProviderOrders = async (req, res) => {
    try {
        const { userId, role } = req;
        const { limit, page, offset } = req.pagination;
        
        if (role !== 'provider') {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // ?all=true returns every order (up to 1000) for dashboards and the calendar
        const all = req.query.all === 'true';
        const orders = await Order.findAll({
            where: { provider_id: userId },
            limit: all ? 1000 : limit,
            offset: all ? 0 : offset,
            order: [['created', 'DESC']],
            include: [
                {
                    model: Service,
                    attributes: ['name', 'cover_image', 'visiting_charge', 'instant_visiting_charge', 'id'],
                },
                {
                    model: CustomerInfo,
                    attributes: ['name', 'email', 'mobile', 'id'],
                }
            ],
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createInstantOrder = async (req, res) => {
    try {
        const { service_id, provider_id, date, estimated_charge, status, issue, location, request_id } = req.body;
        let { lat, lng } = req.body;
        const customerId = req.userId;
        if (req.role !== 'customer') {
            return res.status(403).json({ message: "Only customers can place bookings" });
        }
        const visitingDate = date;
        const visitingCharge = estimated_charge;
        
        // Handle service_id which might be an object or just an ID
        const serviceId = typeof service_id === 'object' ? service_id.id : service_id;
        
        // Validate input data
        if (!serviceId || !provider_id || !customerId || !visitingDate || !visitingCharge || !status || !issue) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the service exists
        const service = await Service.findByPk(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (service.is_active === false) {
            return res.status(400).json({ message: "This service is not available right now" });
        }

        // Check if the provider exists
        const provider = await ProviderInfo.findByPk(provider_id);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Check if the customer exists
        const customer = await CustomerInfo.findByPk(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check if the provider is available on the given date
        const existingOrder = await Order.findOne({
            where: {
                provider_id: provider_id,
                date: visitingDate,
                status: 'PENDING' // Only PENDING orders can be updated
            }
        });


        // Instant orders come from a live service request, which is consumed here.
        // Scheduled bookings have no request_id and always start as PENDING so the
        // provider can accept or decline them.
        let orderStatus = 'PENDING';
        if (request_id) {
            // Instant jobs start straight away, so the provider must be free
            if (await hasRunningTrip(provider_id)) {
                return res.status(409).json({ message: "This professional just started another job. Please choose another offer." });
            }
            const service_request = await ServiceRequest.findByPk(request_id)
            if (!service_request) {
                return res.status(404).json({ message: "Service Request not found" });
            }
            if ((lat == null || lng == null) && service_request.lat != null) {
                lat = service_request.lat;
                lng = service_request.lng;
            }
            service_request.destroy();
            orderStatus = status;
        }

        // Create the order
        const order = await Order.create({
            service_id: serviceId,
            provider_id: provider_id,
            customer_id: customerId,
            date,
            issue,
            location,
            lat: lat != null && lat !== '' ? Number(lat) : null,
            lng: lng != null && lng !== '' ? Number(lng) : null,
            estimated_charge: visitingCharge,
            created: new Date(),
            status: orderStatus
        });

        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Push the latest order state to the customer and provider pages that are open.
const notifyOrderUpdate = (req, order) => {
    const io = req.app.get('io');
    if (!io) return;
    const payload = {
        order_id: order.order_id,
        status: order.status,
        trip_status: order.trip_status || null,
        trip_updated: order.trip_updated || null,
        payment_mode: order.payment_mode || null,
        payment_status: order.payment_status || null,
        payment_ref: order.payment_ref || null
    };
    io.to(`customer-${order.customer_id}`).emit('orderUpdate', payload);
    io.to(`provider-${order.provider_id}`).emit('orderUpdate', payload);
};

// Provider moves a confirmed visit forward:
// START (-> ON_THE_WAY), ARRIVED (-> ARRIVED), COMPLETE (-> order COMPLETED)
const updateTripStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { step } = req.body;
        const { userId, role } = req;

        if (role !== 'provider') {
            return res.status(403).json({ message: "Only providers can update the trip" });
        }

        const order = await Order.unscoped().findOne({ where: { order_id: orderId, provider_id: userId } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== 'CONFIRMED') {
            return res.status(400).json({ message: "Only accepted orders can be started" });
        }

        const now = new Date();
        if (step === 'START') {
            if (order.trip_status) return res.status(400).json({ message: "Trip already started" });
            if (await hasRunningTrip(userId, order.order_id)) {
                return res.status(409).json({ message: "You already have a running trip. Complete it before starting another." });
            }
            // Fresh 4-digit arrival code for the customer to share with the provider
            const pin = String(Math.floor(1000 + Math.random() * 9000));
            await order.update({ trip_status: 'ON_THE_WAY', trip_pin: pin, trip_updated: now, updated: now });
            // On a trip = no Instant Service requests until it's finished
            await goOfflineForTrip(req.app.get('io'), userId);
        } else if (step === 'ARRIVED') {
            if (order.trip_status !== 'ON_THE_WAY') return res.status(400).json({ message: "Start the trip first" });
            if (!order.trip_pin || String(req.body.pin || '').trim() !== order.trip_pin) {
                return res.status(400).json({ message: "Wrong code. Ask the customer for the 4-digit code shown in their booking." });
            }
            await order.update({ trip_status: 'ARRIVED', trip_updated: now, updated: now });
        } else if (step === 'COMPLETE') {
            if (order.trip_status !== 'ARRIVED') return res.status(400).json({ message: "Mark that you reached the location first" });
            // The provider confirms how they were paid; ending the trip means the money is received
            const mode = String(req.body.payment_mode || order.payment_mode || '').toUpperCase();
            if (!PAYMENT_MODES.includes(mode)) {
                return res.status(400).json({ message: "Choose how the customer paid: UPI, cash or net banking" });
            }
            await order.update({ status: 'COMPLETED', payment_mode: mode, payment_status: 'PAID', paid_at: now, trip_updated: now, updated: now });
        } else {
            return res.status(400).json({ message: "Invalid step" });
        }

        notifyOrderUpdate(req, order);
        const safe = order.toJSON();
        delete safe.trip_pin;
        res.status(200).json({ message: "Trip updated", order: safe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const PAYMENT_MODES = ['UPI', 'CASH', 'NET_BANKING'];

const orderAmount = (order) => Number(order.estimated_charge || order.Service?.visiting_charge || 0);

// Where the customer sends the money: the provider's UPI ID or bank account
const payeeFor = async (order, mode) => {
    const bank = await ProviderBank.findByPk(order.provider_id);
    const provider = order.ProviderInfo || (await ProviderInfo.findByPk(order.provider_id, { attributes: ['name'] }));
    const name = bank?.holder_name || provider?.name || 'Service provider';
    if (mode === 'UPI') {
        return bank?.upi_id ? { name, upi_id: bank.upi_id } : null;
    }
    if (mode === 'NET_BANKING') {
        return bank?.account_number && bank?.ifsc_code
            ? { name, account_number: String(bank.account_number), ifsc_code: bank.ifsc_code, bank_name: bank.bank_name || '', branch: bank.branch || '', account_type: bank.account_type || '' }
            : null;
    }
    return { name };
};

const paymentView = async (order) => ({
    order_id: order.order_id,
    amount: orderAmount(order),
    mode: order.payment_mode || null,
    status: order.payment_status || null,
    ref: order.payment_ref || null,
    payee: order.payment_mode ? await payeeFor(order, order.payment_mode) : null
});

const findOrderForPayment = (orderId, where) =>
    Order.findOne({
        where: { order_id: orderId, ...where },
        include: [
            { model: Service, attributes: ['visiting_charge'] },
            { model: ProviderInfo, attributes: ['name'] }
        ]
    });

// Provider (at the customer's place) picks how the customer will pay.
// UPI / net banking wait for the customer to send the money; cash is settled when the trip ends.
const requestPayment = async (req, res) => {
    try {
        if (req.role !== 'provider') {
            return res.status(403).json({ message: "Only providers can ask for payment" });
        }
        const mode = String(req.body.mode || '').toUpperCase();
        if (!PAYMENT_MODES.includes(mode)) {
            return res.status(400).json({ message: "Choose UPI, cash or net banking" });
        }
        const order = await findOrderForPayment(req.params.orderId, { provider_id: req.userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== 'CONFIRMED' || order.trip_status !== 'ARRIVED') {
            return res.status(400).json({ message: "You can take payment after you reach the customer's location" });
        }
        if (mode !== 'CASH' && !(await payeeFor(order, mode))) {
            return res.status(400).json({
                code: 'PAYEE_MISSING',
                message: mode === 'UPI'
                    ? "Add your UPI ID in Account > Bank details to receive UPI payments."
                    : "Add your bank account number and IFSC in Account > Bank details to receive bank transfers."
            });
        }
        // Switching mode starts a fresh request (a customer confirmation for another mode doesn't count)
        const changed = order.payment_mode !== mode;
        await order.update({
            payment_mode: mode,
            payment_status: changed || !order.payment_status ? 'PENDING' : order.payment_status,
            payment_ref: changed ? null : order.payment_ref,
            updated: new Date()
        });
        notifyOrderUpdate(req, order);
        res.status(200).json(await paymentView(order));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Customer or provider of the order reads what is to be paid and where.
const getPayment = async (req, res) => {
    try {
        const where = req.role === 'provider' ? { provider_id: req.userId } : { customer_id: req.userId };
        const order = await findOrderForPayment(req.params.orderId, where);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(await paymentView(order));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Customer says they have sent the UPI / bank payment (with the transaction reference).
const markPaidByCustomer = async (req, res) => {
    try {
        if (req.role !== 'customer') {
            return res.status(403).json({ message: "Access denied" });
        }
        const order = await findOrderForPayment(req.params.orderId, { customer_id: req.userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== 'CONFIRMED' || !['UPI', 'NET_BANKING'].includes(order.payment_mode)) {
            return res.status(400).json({ message: "The provider hasn't asked for an online payment" });
        }
        const ref = String(req.body.ref || '').trim().slice(0, 64);
        if (order.payment_mode === 'NET_BANKING' && ref.length < 6) {
            return res.status(400).json({ message: "Enter the transaction reference number (UTR) from your bank" });
        }
        await order.update({ payment_status: 'CUSTOMER_PAID', payment_ref: ref || null, updated: new Date() });
        notifyOrderUpdate(req, order);
        res.status(200).json(await paymentView(order));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Customer reads the arrival code for their own booking while the provider is on the way.
const getTripPin = async (req, res) => {
    try {
        if (req.role !== 'customer') {
            return res.status(403).json({ message: "Access denied" });
        }
        const order = await Order.unscoped().findOne({
            where: { order_id: req.params.orderId, customer_id: req.userId },
            attributes: ['order_id', 'trip_status', 'trip_pin']
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ pin: order.trip_status === 'ON_THE_WAY' ? order.trip_pin : null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    requestPayment,
    getPayment,
    markPaidByCustomer,
    getTripPin,
    updateTripStatus,
    getOrderById,
    getAllOrders,
    getOrdersByUserId,
    updateOrderStatus,
    getProviderOrders,
    createInstantOrder
}