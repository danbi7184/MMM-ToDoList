Module.register("MMM-ToDoList", {
	requiresVersion: "2.12.0",
	default: {
	},

	getStyles: function () {
    	return ['MMM-ToDoList.css'];
    },

	getHeader: function () {
		return "<i class='fa-regular fa-memo'></i> " + this.config.header;
	},

	start: function () {
		Log.info("Starting module: " + this.name);
	},

	getDom: function () {
		var wrapper = document.createElement("div");
		if (!this.loaded) {
				return wrapper;
		}
		var listInfo = this.listInfo;
		var checkInfo = this.CheckInfo;

		var ToDoTable = document.createElement("table");
		ToDoTable.className = "small";

		var check = document.createElement("tr");
		check.className = "title bright";
		check.innerHTML = checkInfo[0];
		ToDoTable.appendChild(check);


		var Todo1 = document.createElement("td");
		Todo1.innerHTML = listInfo[0];
		check.appendChild(Todo1);

		wrapper.appendChild(ToDoTable);
		return wrapper;
	},

	getListInfo: function () {
	  Log.info("Requesting ToDoList");
	  this.sendSocketNotification("GET_LIST");
	},

	notificationReceived: function (notification) {
	  switch (notification) {
		case "DOM_OBJECTS_CREATED":
		  this.getListInfo();
		  var timer = setInterval(() => {
			this.getListInfo();
		  }, 60000);
		  break;
	  }
	},

	socketNotificationReceived: function (notification, payload) {
	  switch (notification) {
		case "LIST":
		  this.loaded = true;
		  console.log("NotificationReceived:" + notification);
		  this.listInfo = payload;
		  this.updateDom();
		  break;
		case "CHECK":
			console.log("NotificationReceived:" + notification);
			this.checkInfo = payload;
			this.updateDom();
			break;
	  }
	},
  });
