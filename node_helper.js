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
		var list = Array();
		var check = Array();
		var i = 0;

		db.collection("ToDoList").get().then((result) => {
			result.forEach((doc) => {
				list[i] = doc.data().list;
				check[i] = doc.data().checked;
				i++;
			});
			self.sendSocketNotification("CHECK_LIST", list);
		});
	},
});
