Backbone.Model.prototype.idAttribute = 'sid'; 

var Record = Backbone.Model.extend({
	defaults: {
		sid: "",
		sname: "",
		emailid: "",
		contact: "",
		deptid: "",
		deptname: ""
	} 
});

var Records = Backbone.Collection.extend({
	model:  Record,
	//url: 'API Link Here'
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


		var sname = this.$('.sname').html();
		var emailid = this.$('.emailid').html();
		var contact = this.$('.contact').html();
		var deptname = this.$('.deptname').html();


		this.$('.sname').html('<input type="text" class="form-control sname-update" value="' + sname + '">');
		this.$('.emailid').html('<input type="text" class="form-control emailid-update" value="' + emailid + '">');
		this.$('.contact').html('<input type="text" class="form-control contact-update" value="' + contact + '">');
		this.$('.deptname').html('<input type="text" class="form-control dept-update" value="' + deptname + '">');

	},
	update: function () {
		this.model.set('sname', $('.sname-update').val());
		this.model.set('emailid', $('.emailid-update').val());
		this.model.set('contact', Number($('.contact-update').val()));
		this.model.set('deptname', parseInt($('.dept-update').val()));

		$('.edit-record').show();
		$('.delete-record').show();
		$('.update-record').hide();
		$('.cancel').hide();
		var omit =JSON.parse(JSON.stringify(this.model.attributes));
		records.add(_.omit(omit, "deptname"));
		this.model.save(null, {
			success: function (response) {
				console.log("Successfully Updated record with id: " + response.toJSON().sid);
			},
			attrs: _.omit(omit, "deptname"),
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
					console.log("Successfully Deleted record with id:" + response.toJSON().sid);
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
		
				this.model.fetch({
					success: function (response) {
						_.each(response.toJSON(), function (item) {
							console.log("Successfully got record with id:" + item.sid);
						});
					},
					error: function () {
						console.log("Failed to get records");
					}
				});
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
		
		var email = $('.emailid-input').val();
		if($('.sid-input').val()=="" ||$('.sname-input').val() == ""){
			alert("Fill all required field");
		}
		if(IsEmail(email)==false){
			alert("Email is not valid");
			$('.emailid-input').val('');
			$('.emailid-input').focus();
			return false;
		}
		  function IsEmail(email) {
			var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if(!regex.test(email)) {
			  return false;
			}else{
			  return true;
			}
		}
		phone = $('.contact-input').val();
		if (phone.length != 10)
        {
            alert('Phone number must be 10 digits.');
            $('.contact-input').val('');
			$('.contact-input').focus();
			return false;
		}
		
		if($('.dept-input').val()==0){
			alert('Department name is required');
            $('.dept-input').val('');
			$('.dept-input').focus();
			return false;
		}
		
		var record = new Record({
			sid: parseInt($('.sid-input').val()),
			sname: $('.sname-input').val(),
			emailid: $('.emailid-input').val(),
			contact: Number($('.contact-input').val()),
			deptid: parseInt($('.dept-input').val())
		});
		
		var omit =JSON.parse(JSON.stringify(record.attributes));
		
		$('.sid-input').val('');
		$('.sname-input').val('');
		$('.emailid-input').val('');
		$('.contact-input').val('');
		$('.dept-input').val('');

		records.add(_.omit(omit, "deptname"));
		record.save(null, {
			//url: 'API Link Here', 
			type: "POST",
			success: function (response) {
				console.log("Successfully saved record with id:" + response.toJSON().sid);
			},
			attrs: _.omit(omit, "deptname"),
			error: function () {
				console.log("Failed to save record");
				
			}
		});

	});

});

Backbone.history.start();