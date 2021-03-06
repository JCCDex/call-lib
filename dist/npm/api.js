"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const events_1 = require("events");
const common_1 = require("./common");
const server = require("./server/server");
const connect = server.connect;
const disconnect = server.disconnect;
const getServerInfo = server.getServerInfo;
const getFee = server.getFee;
const isConnected = server.isConnected;
const getLedgerVersion = server.getLedgerVersion;
const transaction_1 = require("./ledger/transaction");
const transactions_1 = require("./ledger/transactions");
const trustlines_1 = require("./ledger/trustlines");
const balances_1 = require("./ledger/balances");
const balance_sheet_1 = require("./ledger/balance-sheet");
const pathfind_1 = require("./ledger/pathfind");
const orders_1 = require("./ledger/orders");
const orderbook_1 = require("./ledger/orderbook");
const settings_1 = require("./ledger/settings");
const accountinfo_1 = require("./ledger/accountinfo");
const getAccountInfoByNick_1 = require("./ledger/getAccountInfoByNick");
const getAccountIssues_1 = require("./ledger/getAccountIssues");
const payment_channel_1 = require("./ledger/payment-channel");
const payment_1 = require("./transaction/payment");
const trustline_1 = require("./transaction/trustline");
const order_1 = require("./transaction/order");
const ordercancellation_1 = require("./transaction/ordercancellation");
const escrow_creation_1 = require("./transaction/escrow-creation");
const escrow_execution_1 = require("./transaction/escrow-execution");
const escrow_cancellation_1 = require("./transaction/escrow-cancellation");
const payment_channel_create_1 = require("./transaction/payment-channel-create");
const payment_channel_fund_1 = require("./transaction/payment-channel-fund");
const payment_channel_claim_1 = require("./transaction/payment-channel-claim");
const settings_2 = require("./transaction/settings");
const sign_1 = require("./transaction/sign");
const combine_1 = require("./transaction/combine");
const submit_1 = require("./transaction/submit");
const generate_address_1 = require("./offline/generate-address");
const address_fromSecret_1 = require("./offline/address-fromSecret");
const ledgerhash_1 = require("./offline/ledgerhash");
const sign_payment_channel_claim_1 = require("./offline/sign-payment-channel-claim");
const verify_payment_channel_claim_1 = require("./offline/verify-payment-channel-claim");
const ledger_1 = require("./ledger/ledger");
const rangeset_1 = require("./common/rangeset");
const ledgerUtils = require("./ledger/utils");
const schemaValidator = require("./common/schema-validator");
// prevent access to non-validated ledger versions
class RestrictedConnection extends common_1.Connection {
    request(request, timeout) {
        const ledger_index = request.ledger_index;
        if (ledger_index !== undefined && ledger_index !== 'validated') {
            if (!_.isNumber(ledger_index) || ledger_index > this._ledgerVersion) {
                return Promise.reject(new common_1.errors.LedgerVersionError(`ledgerVersion ${ledger_index} is greater than server\'s ` +
                    `most recent validated ledger: ${this._ledgerVersion}`));
            }
        }
        return super.request(request, timeout);
    }
}
class CallAPI extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.connect = connect;
        this.disconnect = disconnect;
        this.isConnected = isConnected;
        this.getServerInfo = getServerInfo;
        this.getFee = getFee;
        this.getLedgerVersion = getLedgerVersion;
        this.getTransaction = transaction_1.default;
        this.getTransactions = transactions_1.default;
        this.getTrustlines = trustlines_1.default;
        this.getBalances = balances_1.default;
        this.getBalanceSheet = balance_sheet_1.default;
        this.getPaths = pathfind_1.default;
        this.getOrders = orders_1.default;
        this.getOrderbook = orderbook_1.default;
        this.getSettings = settings_1.default;
        this.getAccountInfo = accountinfo_1.default;
        this.getAccountInfoByNick = getAccountInfoByNick_1.default;
        this.getAccountIssues = getAccountIssues_1.default;
        this.getPaymentChannel = payment_channel_1.default;
        this.getLedger = ledger_1.default;
        this.preparePayment = payment_1.default;
        this.prepareTrustline = trustline_1.default;
        this.prepareOrder = order_1.default;
        this.prepareOrderCancellation = ordercancellation_1.default;
        this.prepareEscrowCreation = escrow_creation_1.default;
        this.prepareEscrowExecution = escrow_execution_1.default;
        this.prepareEscrowCancellation = escrow_cancellation_1.default;
        this.preparePaymentChannelCreate = payment_channel_create_1.default;
        this.preparePaymentChannelFund = payment_channel_fund_1.default;
        this.preparePaymentChannelClaim = payment_channel_claim_1.default;
        this.prepareSettings = settings_2.default;
        this.sign = sign_1.default;
        this.combine = combine_1.default;
        this.submit = submit_1.default;
        this.generateAddress = generate_address_1.generateAddressAPI;
        this.fromSecret = address_fromSecret_1.fromSecret;
        this.computeLedgerHash = ledgerhash_1.default;
        this.signPaymentChannelClaim = sign_payment_channel_claim_1.default;
        this.verifyPaymentChannelClaim = verify_payment_channel_claim_1.default;
        this.errors = common_1.errors;
        common_1.validate.apiOptions(options);
        this._feeCushion = options.feeCushion || 1.2;
        const serverURL = options.server;
        if (serverURL !== undefined) {
            this.connection = new RestrictedConnection(serverURL, options);
            this.connection.on('ledgerClosed', message => {
                this.emit('ledger', server.formatLedgerClose(message));
            });
            this.connection.on('transaction', message => {
                this.emit('transactions', message);
            });
            this.connection.on('error', (errorCode, errorMessage, data) => {
                this.emit('error', errorCode, errorMessage, data);
            });
            this.connection.on('connected', () => {
                this.emit('connected');
            });
            this.connection.on('disconnected', code => {
                this.emit('disconnected', code);
            });
        }
        else {
            // use null object pattern to provide better error message if user
            // tries to call a method that requires a connection
            this.connection = new RestrictedConnection(null, options);
        }
    }
}
// these are exposed only for use by unit tests; they are not part of the API.
CallAPI._PRIVATE = {
    validate: common_1.validate,
    RangeSet: rangeset_1.default,
    ledgerUtils,
    schemaValidator
};
exports.CallAPI = CallAPI;
//# sourceMappingURL=api.js.map