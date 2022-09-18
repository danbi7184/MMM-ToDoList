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

		var ToDoTable = document.createElement("table");
		ToDoTable.className = "small";

		for(var i=0; i<list.length; i++) {
			RowArr[i] = 'row' + i;
			listArr[i] = 'list' + i;
			checkArr[i] = 'check' + i;

			RowArr[i] = document.createElement("tr");
			RowArr[i].className = "title bright";
			ToDoTable.appendChild(RowArr[i]);
			

			checkArr[i] = document.createElement("td");
			inputArr[i] = document.createElement("input");
			inputArr[i].type = 'checkbox';

			listArr[i] = document.createElement("td");
			listArr[i].innerHTML = list[i];

			if(check[i] == 'true') {
				listArr[i].style.color = '#A5A5A5';
				listArr[i].style.textDecoration = 'line-through';
				inputArr[i].checked = true;
			} else {
				listArr[i].style.color = '#ffffff';
				listArr[i].style.textDecoration = 'none';
			}

			// inputArr[i].onclick = () => {
			// 	if(inputArr[i].checked) {
			// 		inputArr[i].checked = false;
			// 		listArr[i].style.color = '#ffffff';
			// 		listArr[i].style.textDecoration = 'none';
			// 	} else {
			// 		inputArr[i].checked = true;
			// 		listArr[i].style.color = '#A5A5A5';
			// 		listArr[i].style.textDecoration = 'line-through';
			// 	}
			// }

			checkArr[i].appendChild(inputArr[i]);
			RowArr[i].appendChild(checkArr[i]);
			RowArr[i].appendChild(listArr[i]);
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
	  }
	},
  });
