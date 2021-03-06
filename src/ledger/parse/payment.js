"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var assert = require("assert");
var utils = require("./utils");
var common_1 = require("../../common");
var amount_1 = require("./amount");
function isNoDirectCall(tx) {
    return (tx.Flags & common_1.txFlags.Payment.NoCallDirect) !== 0;
}
function isQualityLimited(tx) {
    return (tx.Flags & common_1.txFlags.Payment.LimitQuality) !== 0;
}
function removeGenericCounterparty(amount, address) {
    return amount.counterparty === address ?
        _.omit(amount, 'counterparty') : amount;
}
function parsePayment(tx) {
    assert(tx.TransactionType === 'Payment');
    var source = {
        address: tx.Account,
        maxAmount: removeGenericCounterparty(amount_1.default(tx.SendMax || tx.Amount), tx.Account),
        tag: tx.SourceTag
    };
    var destination = {
        address: tx.Destination,
        amount: removeGenericCounterparty(amount_1.default(tx.Amount), tx.Destination),
        tag: tx.DestinationTag
    };
    return common_1.removeUndefined({
        source: common_1.removeUndefined(source),
        destination: common_1.removeUndefined(destination),
        memos: utils.parseMemos(tx),
        invoiceID: tx.InvoiceID,
        paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
        allowPartialPayment: utils.isPartialPayment(tx) || undefined,
        noDirectCall: isNoDirectCall(tx) || undefined,
        limitQuality: isQualityLimited(tx) || undefined
    });
}
exports.default = parsePayment;
