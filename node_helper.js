const NodeHelper = require("node_helper");
var admin = require("firebase-admin");
var firestore = require("firebase-admin/firestore");

var serviceAccount = require("./credentials.json");

const db = firestore.getFirestore();

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount)
		});
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
		firebase
			.database()
			.ref(this.config.databaseURL)
			.off();
	},
});
