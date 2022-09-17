Module.register("MMM-ToDoList", {
	requiresVersion: "2.12.0",
	default: {
	},

	getHeader: function () {
		return "<i class='fa-light fa-memo fa-7x' style='color:#ffffff'></i> " + this.config.header;
	},

    getStyles: function () {
        return ['MMM-ToDoList.css'];
    },

	start: function () {
	  Log.info("Starting module: " + this.name);
	},

	getDom: function () {
	  var wrapper = document.createElement("div");
	  if (!this.loaded) {
			return wrapper;
	  }
		var ToDoTable = document.createElement("table");
		ToDoTable.className = "small";

		var check = document.createElement("tr");
		ToDoTable.appendChild(check);

		var CheckInfo = this.CheckInfo;

		var Todo1 = document.createElement("td");
        Todo1.innerHTML = CheckInfo[0];
        check.appendChild(Todo1);

		 wrapper.appendChild(ToDoTable);
		 return wrapper;
	},

	getListInfo: function () {
	  Log.info("Requesting ToDoList");
	  this.sendSocketNotification("GET_LIST");
	},

	notificationReceived: function (notification, payload, sender) {
	  switch (notification) {
		case "DOM_OBJECTS_CREATED":
		  this.getListInfo();
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
