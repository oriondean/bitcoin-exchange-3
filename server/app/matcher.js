var EventEmitter = require("events");
var Trade = require("./trade/trade");
var Util = require("util");
/**
 * Creates new Matcher
 * @constructor
 */
function Matcher() {
    EventEmitter.call(this);

    this.bidOrders = []; // sorted lowest to highest price (best offer)
    this.askOrders = []; // sorted highest to lowest price (best offer)
}

Util.inherits(Matcher, EventEmitter);

/**
 * Attempts to match new order with existing orders, otherwise adds it to be matched
 * @param newOrder
 */
Matcher.prototype.onNewOrder = function(newOrder) {
    var order = this.match(newOrder, newOrder.isBid() ? this.askOrders : this.bidOrders);

    if(order) {
        var index = 0;
        var orders = order.isBid() ? this.bidOrders : this.askOrders;

        while(orders[index] && !orders[index].hasWorsePrice(order)) {
            index++;
        }

        this.emit("new-order", order);
        orders.splice(index, 0, order);
    }
};

/**
 * Matches an order with potential candidate orders
 *
 * @param toMatch new order that needs a match
 * @param candidates potential orders that can be matched
 * @returns {order} null if order has been fully matched, otherwise remaining part of order
 */
Matcher.prototype.match = function(toMatch, candidates) {
    var order = toMatch;

    while(!!candidates[0] && order.canMatch(candidates[0])) {
        var existingOrder = candidates[0];
        var matchedQuantity = Math.min(existingOrder.quantity, order.quantity);

        // match at existing order's price, and lowest quantity
        this.emit("new-trade", new Trade(existingOrder.price, matchedQuantity, order.action));

        if(order.quantity >= existingOrder.quantity) {
            this.emit("matched-order", existingOrder);
            candidates.splice(0, 1); // existing fully matched, remove

            if(order.quantity === existingOrder.quantity) {
                return null; // new order fully matched
            }

            order = order.reduceQuantity(existingOrder.quantity);
        } else {
            candidates[0] = existingOrder.reduceQuantity(order.quantity); // existing partially matched
            this.emit("partially-matched-order", candidates[0], existingOrder, matchedQuantity);

            return null; // new order fully matched
        }
    }

    return order;
};

module.exports = Matcher;