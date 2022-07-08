const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const role = require('../controllers/role');
const access = require('../controllers/access');
const userRole = require('../controllers/userRole');
const sessionExpire = require('../controllers/sessionExpire');
const salvageStatus = require('../controllers/salvageStatus');
const buyer = require('../controllers/buyer');
const state = require('../controllers/state');
const brand = require('../controllers/brand');
const item = require('../controllers/item');
const bidStatus = require('../controllers/bidStatus');
const bid = require('../controllers/bid');


router.get('/login-form', user.loginForm);

router.post('/create-user',user.create);

router.get('/dashboard', user.dashboard);

router.post('/login', user.login);

router.get('/logout',user.logout);

router.get('/all-users',user.all);

router.get('/create-user-form',user.createForm);

router.get('/session-expired',sessionExpire.end);

router.get('/delete-user/:id',user.remove);

router.get('/edit-user-form/:id',user.editUserForm);

router.post('/edit-user',user.editUser);

router.get('/view-user/:id', user.view);

router.get('/change-password-form/:id', user.changePasswordForm);

router.post('/change-password', user.changePassword);

router.get('/update-profile-form',user.updateProfileForm);

router.post('/update-profile', user.updateProfile);

router.get('/all-roles', role.all);

router.get('/create-role-form', role.createForm);

router.post('/create-role',role.create);

router.get('/edit-role-form/:id', role.updateForm);

router.post('/update-role',role.update);

router.get('/delete-role/:id', role.remove);

router.get('/view-role/:id', role.view);

router.post('/api/create-user', user.apiCreate);

router.get('/all-user-roles/:id', userRole.all);

router.get('/create-user-role-form/:id',userRole.createForm);

router.post('/create-user-role',userRole.create);

router.get('/delete-user-role/:id',userRole.remove);

router.get('/edit-user-role-form/:id', userRole.editForm);

router.post('/edit-user-role',userRole.edit);

router.get('/forbidden', access.forbidden);

router.get('/change-user-password-form/:id', user.changeUserPasswordForm);

router.post('/change-user-password',user.changeUserPassword);

router.get('/all-salvage-status', salvageStatus.all);

router.get('/create-salvage-status-form', salvageStatus.createForm);

router.post('/create-salvage-status', salvageStatus.create);

router.get('/edit-salvage-status-form/:id',salvageStatus.editForm);

router.post('/edit-salvage-status', salvageStatus.edit);

router.get('/delete-salvage-status/:id', salvageStatus.remove);

router.get('/view-salvage-status/:id', salvageStatus.view);

router.get('/all-buyers',buyer.all);

router.get('/create-buyer-form', buyer.createForm);

router.post('/create-buyer', buyer.create);

router.get('/edit-buyer-form/:id',buyer.editForm);

router.post('/edit-buyer',buyer.edit);

router.get('/delete-buyer/:id',buyer.remove);

router.get('/view-buyer/:id', buyer.view);

router.get('/all-states', state.all);

router.get('/create-state-form', state.createForm);

router.post('/create-state', state.create);

router.get('/edit-state-form/:id', state.editForm);

router.post('/edit-state', state.edit);

router.get('/delete-state/:id', state.remove);

router.get('/view-state/:id', state.view);

router.get('/all-brands', brand.all);

router.get('/create-brand-form', brand.createForm);

router.post('/create-brand', brand.create);

router.get('/edit-brand-form/:id', brand.editForm);

router.post('/edit-brand', brand.edit);

router.get('/delete-brand/:id', brand.remove);

router.get('/view-brand/:id', brand.view);

router.get('/all-items', item.all);

router.get('/create-item-form', item.createForm);

router.post('/create-item',item.create);

router.get('/all-pending-items',item.allPending);

router.get('/edit-approve-item/:id', item.approvePending);

router.post('/approve-item', item.approved);

router.get('/all-approved-items', item.allApproved);

router.get('/view-approved-item/:id', item.viewApproved);

router.post('/delete-item', item.deleted);

router.get('/all-bid-status', bidStatus.all);

router.get('/create-bid-status-form', bidStatus.createForm);

router.post('/create-bid-status',bidStatus.create);

router.get('/view-bid-status/:id', bidStatus.view);

router.get('/edit-bid-status-form/:id', bidStatus.editForm);

router.post('/edit-bid-status', bidStatus.edit);

router.get('/delete-bid-status/:id', bidStatus.remove);

router.get('/view-item-bids/:id', bid.viewItemBids);

router.get('/view-buyer-info/:id', buyer.buyerInfo);

router.get('/approve-bid/:id', bid.approveBid);

router.get('/all-closed-items', item.allClosed);

router.get('/view-approved-buyer/:id', buyer.approveBuyer);

router.get('/view-all-closed-item-bids/:id', bid.viewClosedBid)

router.get('/view-buyer-closed-bid/:id', bid.viewBuyerClosedBid);

router.get('/delete-item-closed/:id', item.deletedClosedItem);

router.get('/all-deleted-items', item.allDeleted);

router.get('/view-deleted-item/:id', item.deletedItem);

module.exports = router;