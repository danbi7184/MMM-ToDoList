const NodeHelper = require("node_helper");
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("./ServiceAccount.json");

var db;

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
		try {
			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount)
			});
		}  catch(error) {
		}
		db = firestore.getFirestore();
	},

	socketNotificationReceived: function(notification, payload) {
		switch(notification) {
			case "GET_LIST":
				this.getToDoList();
				break;
			case "TRUE":
				this.setTrue(payload);
				break;
			case "FALSE":
				this.setFalse(payload);
				break;
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
			self.sendSocketNotification("LIST", list);
			self.sendSocketNotification("CHECK", check);
		});
	},

	setTrue: async function(payload) {
		var self = this;
		var doc = 'todo' + (payload.k + 1);
	
		try {
			db.collection("ToDoList").doc(doc).update({
				checked: true,
			});
		} catch(error) {
		}
		self.sendSocketNotification("SET_TRUE");
	},

	setFalse: async function(payload) {
		var self = this;
		var doc = 'todo' + (payload.k + 1);
		
		try{
			db.collection("ToDoList").doc(doc).update({
				checked: false,
			});
		} catch(error) {
		}
		self.sendSocketNotification("SET_FALSE");
	}
});
