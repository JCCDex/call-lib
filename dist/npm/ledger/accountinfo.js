"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
function hexToStringWide(h) {
    let a = [];
    let i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i < h.length; i += 4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i + 4), 16)));
    }
    return a.join('');
}
function formatAccountInfo(response) {
    const data = response.account_data;
    const obj = {
        sequence: data.Sequence,
        callBalance: common_1.dropsToCall(data.Balance),
        ownerCount: data.OwnerCount,
        previousInitiatedTransactionID: data.AccountTxnID,
        previousAffectingTransactionID: data.PreviousTxnID,
        previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq
    };
    if (data.NickName)
        obj.nickName = hexToStringWide(hexToStringWide(data.NickName));
    return common_1.removeUndefined(obj);
}
function getAccountInfo(address, options = {}) {
    common_1.validate.getAccountInfo({ address, options });
    const request = {
        command: 'account_info',
        account: address,
        ledger_index: options.ledgerVersion || 'validated'
    };
    return this.connection.request(request).then(formatAccountInfo);
}
exports.default = getAccountInfo;
//# sourceMappingURL=accountinfo.js.map