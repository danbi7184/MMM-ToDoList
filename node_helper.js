const NodeHelper = require("node_helper");
var admin = require("firebase-admin");
var firestore = require("firebase-admin/firestore");

var serviceAccount = require("./credentials.json");


module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
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
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://todolisteg-2b6f9-default-rtdb.firebaseio.com/"
		});
		var db = firestore.getFirestore();

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
