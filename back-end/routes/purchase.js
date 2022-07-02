const express = require('express');

const purchaseController = require('../controllers/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

router.post('/checkPremiumMembership', purchaseController.checkPremiumMembership )

router.get('/getallpremusers', purchaseController.getallpremusers)


module.exports = router;