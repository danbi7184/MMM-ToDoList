const NodeHelper = require("node_helper");
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("./credentials.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
		const db = firestore.getFirestore();
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'GET_LIST') {
			this.getToDoList();
			return true;
		}
		return false;
	},

	getToDoList: async function() {
		let self = this;

		db.collection("ToDoList").get().then((result) => {
			result.forEach((doc) => {
				self.sendSocketNotification("CHECK_LIST", doc.data().checked);
			});
		});
	},

	stop: function() {
		admin
			.database()
			.ref(this.config.databaseURL)
			.off();
	},
});
