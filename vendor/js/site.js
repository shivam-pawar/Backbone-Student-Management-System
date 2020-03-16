Backbone.Model.prototype.idAttribute = 'studentId'; 

var Record = Backbone.Model.extend({
	defaults: {
		studentId: 100,
		name: "",
		age: 20,
		classn: "",
		department: ""
	}
});


var Records = Backbone.Collection.extend({
	model:  Record,
	url: 'https://localhost:44392/api/StudentDatas'
});


var records = new Records();

var RecordView = Backbone.View.extend({
	model: new Record(),
	tagName: 'tr',
	initialize: function () {
		this.template = _.template($('.records-list-template').html());
	},
	events: {
		'click .edit-record': 'edit',
		'click .update-record': 'update',
		'click .cancel': 'cancel',
		'click .delete-record': 'delete'
	},
	edit: function () {
		$('.edit-record').hide();
		$('.delete-record').hide();
		this.$('.update-record').show();
		this.$('.cancel').show();


		var name = this.$('.name').html();
		var age = this.$('.age').html();
		var classn = this.$('.classn').html();
		var dept = this.$('.dept').html();


		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.age').html('<input type="text" class="form-control age-update" value="' + age + '">');
		this.$('.classn').html('<input type="text" class="form-control classn-update" value="' + classn + '">');
		this.$('.dept').html('<input type="text" class="form-control dept-update" value="' + dept + '">');

	},
	update: function () {
		this.model.set('name', $('.name-update').val());
		this.model.set('age', parseInt($('.age-update').val()));
		this.model.set('classn', $('.classn-update').val());
		this.model.set('department', $('.dept-update').val());

		$('.edit-record').show();
		$('.delete-record').show();
		$('.update-record').hide();
		$('.cancel').hide();

		this.model.save(null, {
			success: function (response) {
				console.log("Successfully Updated record with id: " + response.toJSON().studentId);
			},
			error: function (response) {
				console.log("Failed to Update record");
			}
		});

	},
	cancel: function () {
		recordsView.render();
	},

	delete: function () {
		if (confirm("Delete this record?")) {
			this.model.destroy({
				success: function (response) {
					console.log("Successfully Deleted record with id:" + response.toJSON().studentId);
				},
				error: function () {
					console.log("Failed to delete record");
				}
			});
		}
	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var RecordsView = Backbone.View.extend({
	model: records,
	el: $('.records-list'),
	initialize: function () {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function () {
			setTimeout(function () {
				self.render();
			}, 30);
		}, this);
		this.model.on('remove', this.render, this); 
		var url = window.location.href;
		if (url === 'https://localhost:44392/') {
			document.getElementById('displayRecord').onclick = findrecord;
		}
			function findrecord() {
				self.model.fetch({
					success: function (response) {
						_.each(response.toJSON(), function (item) {
							console.log("Successfully got record with id:" + item.studentId);
						});
					},
					error: function () {
						console.log("Failed to get records");
					}
				});
			}
		},
	render: function () {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function (record) {
			self.$el.append((new RecordView({ model: record })).render().$el);
		});
		return this;
	}
});

var recordsView = new RecordsView();

$(document).ready(function () {
	$('.add-record').on('click', function () {
		var record = new Record({
			studentId: parseInt($('.id-input').val()),
			name: $('.name-input').val(),
			age: parseInt($('.age-input').val()),
			classn: $('.class-input').val(),
			department: $('.dept-input').val()
		});
		$('.id-input').val('');
		$('.name-input').val('');
		$('.age-input').val('');
		$('.class-input').val('');
		$('.dept-input').val('');

		records.add(record);
		record.save(null, {
			url: 'https://localhost:44392/api/StudentDatas', 
			type: "POST",
			success: function (response) {
				console.log("Successfully saved record with id:" + response.toJSON().studentId);
			},
			error: function () {
				console.log("Failed to save record");
			}
		});

	});
});

Backbone.history.start();