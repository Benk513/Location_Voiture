// createPaymentIntent	Créer un paiement sécurisé avec Stripe	POST	/api/payments/intent
// confirmPayment	Confirmer un paiement réussi et enregistrer la transaction	POST	/api/payments/confirm
// getUserPayments	Récupérer l'historique des paiements d’un utilisateur	GET	/api/payments/user/:userId
// refundPayment	Rembourser un paiement en cas d'annulation	POST	/api/payments/refund/:paymentId