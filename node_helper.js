const NodeHelper = require("node_helper");
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("./ServiceAccount.json");

var db;

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
	},

	socketNotificationReceived: function(notification) {
		if(notification === 'GET_LIST') {
			try {
				admin.initializeApp({
					credential: admin.credential.cert(serviceAccount)
				});
			}  catch(error) {
			}
			db = firestore.getFirestore();
			this.getToDoList();
		}
	},

	getToDoList: async function() {
		let self = this;

		db.collection("ToDoList").get().then((result) => {
			result.forEach((doc) => {
				data = doc.data();
				self.sendSocketNotification("CHECK_LIST", data);
			});
		});
	},
});
