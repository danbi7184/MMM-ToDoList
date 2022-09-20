const NodeHelper = require("node_helper");
const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("./ServiceAccount.json");

var db;

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting nodehelper: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		switch(notification) {
			case "GET_LIST":
				try {
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount)
					});
				}  catch(error) {
				}
				db = firestore.getFirestore();
				this.getToDoList();
				break;
			case "TRUE":
				try {
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount)
					});
				}  catch(error) {
				}
				db = firestore.getFirestore();
				this.setTrue(payload);
				break;
			case "FALSE":
				try {
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount)
					});
				}  catch(error) {
				}
				db = firestore.getFirestore();
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
	
		db.collection("ToDoList").doc(doc).update({
			checked: true,
		});
		self.sendSocketNotification("SET_TRUE");
	},

	setFalse: async function(payload) {
		var self = this;
		console.log(payload);
		var doc = 'todo' + (payload.k + 1);
		
		db.collection("ToDoList").doc(doc).update({
			checked: false,
		});
		self.sendSocketNotification("SET_FALSE");
	}
});
