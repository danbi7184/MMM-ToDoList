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
		var CheckInfo = this.CheckInfo;

		var ToDoTable = document.createElement("table");
		ToDoTable.className = "small";

		var check = document.createElement("tr");
		check.className = "title bright";
		check.innerHTML = "가나다";
		ToDoTable.appendChild(check);


		var Todo1 = document.createElement("td");
		Todo1.innerHTML = CheckInfo;
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
			this.getSubwayInfo();
		  }, 60000);
		  break;
	  }
	},

	socketNotificationReceived: function (notification, payload) {
	  switch (notification) {
		case "CHECKLIST":
		  this.loaded = true;
		  console.log("NotificationReceived:" + notification);
		  this.CheckInfo = payload;
		  this.updateDom();
		  break;
		case "CHECKLIST_ERROR":
		  this.updateDom();
		  break;
	  }
	},
  });
