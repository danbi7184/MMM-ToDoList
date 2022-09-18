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
		var list = this.listInfo;
		var check = this.checkInfo;

		var RowArr = new Array();
		var listArr = new Array();
		var checkArr = new Array();
		var inputArr = new Array();
		var checkedArr = new Array();

		var ToDoTable = document.createElement("table");
		ToDoTable.className = "small";

		for(var i=0; i<list.length; i++) {
			RowArr[i] = document.createElement("tr");
			RowArr[i].className = "title bright";
			ToDoTable.appendChild(RowArr[i]);
			

			checkArr[i] = document.createElement("td");
			inputArr[i] = document.createElement("input");
			inputArr[i].type = 'checkbox';

			listArr[i] = document.createElement("td");
			listArr[i].id = 'list' + i;
			listArr[i].innerHTML = list[i];

			if(check[i] == true) {
				listArr[i].className = 'line-through';
				inputArr[i].checked = true;
				checkedArr[i] = true;
			} else {
				listArr[i].className = 'none';
				checkedArr[i] = false;
			}

			checkArr[i].appendChild(inputArr[i]); 
			RowArr[i].appendChild(checkArr[i]);
			RowArr[i].appendChild(listArr[i]);
		}

		for(var k=0; k<list.length; k++) {
			inputArr[k].onclick = () => {
				var listId = 'list' + k;
				var getList = document.getElementById(listId);
				if(checkedArr[k]) {
					//getList.className = 'none';
					//checkedArr[k].checked = false;
					this.sendSocketNotification("TRUE", {
						num: k,
					});
				} else {
					//getList.className = 'line-through';
					//checkedArr[k].checked = true;
					this.sendSocketNotification("FALSE", {
						num: k,
					});
				}
			}
		}

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
			this.loaded = true;
			console.log("NotificationReceived:" + notification);
			this.checkInfo = payload;
			this.updateDom();
			break;
		case "SET_TRUE":
			console.log("NotificationReceived:" + notification);
			this.updateDom();
			break;
		case "SET_FALSE":
			console.log("NotificationReceived:" + notification);
			this.updateDom();
			break;
	  }
	},
  });
