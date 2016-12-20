;(function($){

	// 用于检测符合yyyy/mm/dd的字符串

	var regDate1 = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;

	// 用于检测符合yyyy-mm-dd的字符串

	var regDate2 = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

	// 用于标志不同的日期选择器

	var count = 0;

	$.extend({

		// 判断参数是否为array对象，是返回true，否则返回false

		isArray: function(v) {

			return Object.prototype.toString.call(v) === '[object Array]';

		},

		// 判断参数是否为object对象，是返回true，否则返回false

		isObject: function(v) {

			return Object.prototype.toString.call(v) === '[object Object]';

		},

		// 判断传入的字符串是否符合时间格式，是返回ture，否则返回false

		isDate: function(v){

			if(v===undefined || !v){

				return false;
			}

			var dateArr = v.match(regDate1) || v.match(regDate2);

			var obj = new Date(dateArr[1],dateArr[2]-1,dateArr[3]);

			return !!(obj.getFullYear()==dateArr[1] && obj.getMonth()==dateArr[2]-1 && obj.getDate()==dateArr[3]);

		},

		// 将字符串形式的日期转化为数组形式并返回

		formateDate : function(v){

			var dateArr = v.match(regDate1) || v.match(regDate2);

			return dateArr;

		},

		// 获取该年该月的天数

		getDays : function(year,month){

			var gapYear = (year % 4 == 0) && (year % 100 !=0 || year %400 ==0);

			return (month==4||month==6||month==9||month==11)? 30 : month!=2 ? 31 : gapYear ? 29 :28;

		},

		// 获取该年该月第一天是星期几

		getWeek : function(year,month){

			return new Date(year+'/'+month+'/'+"1").getDay();

		}
	})

	var dateEvent = function(val){

		this.$ele = $(val);

		this.param = this.$ele.data('lzdate-param');

		this.status = this.$ele.data('lzdate-status');

		this.box = this.$ele.data('lzdate-box');

	}


	// 设置事件函数，用于调用所有事件函数

	dateEvent.prototype.setEvent = function(){

		// 初始化对象和参数

		var event = this,

		param = this.param;

		// 如果事件（event）参数为数组，则调用所有事件函数

		if($.isArray(param.event)){

			// 调用所有事件函数以绑定元素

			$.each(param.event, function(index, val) {
				
				event[val]  && event[val]();

			});

		// 如果事件（event）参数不为数组，则调用当前事件

		}else{

			event[param.event] && event[param.event]();

		}

	}

	dateEvent.prototype.display = function(){

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		box = this.box;

		me.off('.lzdate').on('click.lzdate', function(e) {
			
			e.stopPropagation();
			
			self.dateexcute.setPosition();

			self.dateexcute.setDate();

			self.dateexcute.setDays();

			$('.lzdate-box').css('display','none');

			box.css('display','block')
		});

		box.off('.lzdate').on('click.lzdate', function(e) {

			e.stopPropagation()

		});

		$(document).on('click', function(e) {

			e.preventDefault();

			$('.lzdate-box').css('display','none');

		});

	}

	dateEvent.prototype.change = function(){

		var me = this.$ele,

		self = me.get(0),

		box = this.box,

		status = this.status;

		box.find('.lzdate-header').off('.lzdate').on('click.lzdate', function(e) {

			e.preventDefault();

			var target = e.target || e.srcElement;

			if(target.nodeName.toLowerCase()==='p'){

				var i = $(target);

				if(i.hasClass('lzdate-prev-year')) status.year -=1;

				if(i.hasClass('lzdate-prev-month')) status.month -=1;

				if(i.hasClass('lzdate-next-year')) status.year +=1;

				if(i.hasClass('lzdate-next-month')) status.month +=1;

				if(status.month==0){

					status.year -=1;

					status.month =12;

				}else if(status.month>12){

					status.year +=1;

					status.month =1;

				}

				self.dateexcute.setDate();

				self.dateexcute.setDays();

			}
		});

	}

	dateEvent.prototype.value = function(){

		var me = this.$ele,

		box = this.box,

		param = this.param,

		status = this.status;

		box.find('.lzdate-days').off('.lzdate').on('click.lzdate', function(e) {

			e.preventDefault();

			var target = e.target || e.srcElement;

			if(target.nodeName.toLowerCase()==='li'){

				if($(target).hasClass('lzdate-disable')) return false;

				var day = $(target).html()=='今天'? new Date(status.cDate).getDate():$(target).html();

				me.val(status.year +'-' +status.month + '-'+day);

				status.selectDate = status.year +'-' +status.month + '-'+day;

				box.css('display','none');

				(typeof param._onSelect ==='function') && param._onSelect.call(this,param,status);

			}
		});

	}

	var dateMethods = function(val){

		this.$ele = $(val);

		this.param = this.$ele.data('lzdate-param');

		this.status = this.$ele.data('lzdate-status');

	}

	dateMethods.prototype.setPosition = function(){

		var me = this.$ele,

		box = me.data('lzdate-box');

		box.css({

			top:me.offset().top+me.height()+6,

			left: me.offset().left

		})

	}

	dateMethods.prototype.setDate = function(){

		var status = this.status,

		box = this.$ele.data('lzdate-box');

		box.find('.lzdate-main').find('span').eq(0).html(status.year);

		box.find('.lzdate-main').find('span').eq(1).html(status.month);

	}

	dateMethods.prototype.setDays = function(){

		var me = this.$ele,

		param = this.param,

		status = this.status,

		box = me.data('lzdate-box'),

		elem = null,

		smDate = status.smDate,

		lgDate = status.lgDate,

		cDate = status.cDate,

		daysNum = $.getDays(status.year,status.month),

		weekNum = $.getWeek(status.year,status.month),

		days = document.createDocumentFragment();

		for(var i =1;i<daysNum;i++){

			if(cDate[1] ==status.year && cDate[2]==status.month && cDate[3]==i && param.today){

				elem = $('<li>今天</li>').addClass('lzdate-today');

			}else{

				elem = $('<li>'+i+'</li>');

			}

			var flagsm = (smDate[1]-0) <status.year || (smDate[1] ==status.year && (smDate[2]-0)<status.month) || (smDate[1]==status.year && smDate[2]==status.month && (smDate[3]-0)<=i);

			var flaglg = (lgDate[1]-0) >status.year || (lgDate[1] ==status.year && (lgDate[2]-0)>status.month) || (lgDate[1]==status.year && lgDate[2]==status.month && (lgDate[3]-0)>=i);

			if(!flaglg || !flagsm) elem.addClass('lzdate-disable');

			$(days).append(elem);

		}

		box.find('.lzdate-days').html(days);

		box.find('.lzdate-days li').eq(0).css('marginLeft',weekNum*32);

	}

	var dateInit = function(val,a,b,c,d){

		this.$ele = $(val);

		this.$ele.data('lzdate-param',this.initParam(a,b,c,d));

		this.$ele.data('lzdate-status',{
			boxid:null,
			dateBox:null,
			cDate:null,
			lgDate:null,
			smDate:null,
			year:null,
			month:null,
			selectDate:null,
			mouseH:false
		})

	}

	dateInit.prototype.layout = function(){

		var me = this.$ele,

		param = me.data('lzdate-param'),

		status = me.data('lzdate-status');

		me.attr('readonly','readonly');

		var date = new Date();

		status.cDate = $.formateDate(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());

		status.lgDate = $.formateDate(param.lgDate);

		status.smDate = $.formateDate(param.smDate);

		status.year = date.getFullYear();

		status.month = date.getMonth()+1;

		status.boxid = 'lzbox-'+(count++);

		var temp = "";

		temp += "<div id='"+status.boxid+"' class='lzdate-box'>";

		temp += "<div class='lzdate-header'>";

		temp += "<p class='lzdate-prev-year'></p>";

		temp += "<p class='lzdate-prev-month'></p>";

		temp += "<p class='lzdate-main'>";

		temp += "<span></span>年";

		temp += "<span></span>月";

		temp += "</p>";

		temp += "<p class='lzdate-next-month'></p>";

		temp += "<p class='lzdate-next-year'></p>";

		temp += "</div>";

		temp += "<ul class='lzdate-weeks'>";

		temp += "<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>";

		temp += "</ul>";

		temp += "<ul class='lzdate-days'></ul>";

		temp +="</div>"

		$("body").append(temp);
		
		me.data('lzdate-box',$('#'+status.boxid));
	}

	dateInit.prototype.initEvent = function(){

		var me = this.$ele,

		event = new dateEvent(me);

		event.setEvent();

	}

	dateInit.prototype.initParam = function(a,b,c,d){

		var param = {

			smDate : '1970-01-01',

			lgDate : '2020-12-31',

			today : true,

			event : ['display','change','value'],

			_onSelect : null

		}

		if($.isObject(a)){

			param = $.extend({},param,a);

		}else{

			param.smDate = a;

			param.lgDate = b;

			param.today = c;

			param._onSelect = d;

		}

		typeof a ==='boolean' && (param.today=a);

		typeof a ==='function' && (param._onSelect=a);

		if(this.$ele.data('lzdate-param')){

			param = $.extend({},param,this.$ele.data('lzdate-param'));

		}

		!$.isDate(param.smDate) &&　(param.smDate = '1970-01-01');

		!$.isDate(param.lgDate) && (param.lgDate = '2020-12-31');

		param.today = (param.today===false)?false:true;

		param._onSelect = typeof param._onSelect =='function'? param._onSelect : null;

		return param;

	}


	var tool = function(val){

		this.$ele = $(val);

	}

	tool.prototype.destory = function(){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzdate-box').remove();

			$(val).off('.lzdate');

			$(val).removeData('lzdate-param').removeData('lzdate-status');

		})

		return false;

	}

	tool.prototype.init = function(a,b,c,d){

		var me = this.$ele;

		$.each(me,function(index,val){

			$(val).data('lzdate-box').remove();

			$(val).off('.lzdate');

			$(val).removeData('lzdate-param').removeData('lzdate-status');

		})

		me.lzdate(a,b,c,d);

	}

	tool.prototype.getDate = function(){

		var status = this.$ele.data('lzdate-status');

		return status.selectDate;

	}

	tool.prototype.setDate = function(str){

		var me = this.$ele;

		if($.isDate(str)){

			var date = $.formateDate(str);

			$.each(me,function(index,val){

				var status = $(val).data('lzdate-status');

				status.year = date[1]-0;

				status.month = date[2]-0;

				status.selectDate = str;

				$(val).val(str);

				val.dateexcute.setDate();

				val.dateexcute.setDays();

			})

		}

		return this;	

	}

	tool.prototype.setSmDate = function(str){

		var param = this.$ele.data('lzdate-param'),

		status = this.$ele.data('lzdate-status');

		if($.isDate(str)){

			param.smDate = str;

			status.smDate = $.formateDate(str);

		}

		return this;

	}

	tool.prototype.setLgDate = function(str){

		var param = this.$ele.data('lzdate-param'),

		status = this.$ele.data('lzdate-status');

		if($.isDate(str)){

			param.lgDate = str;

			status.lgDate = $.formateDate(str);

		}

		return this;

	}

	tool.prototype.on = function(str,fn){

		var me = this.$ele;

		if(str==='select'){

			$.each(me,function(index,val){

				if(typeof fn ==='function') $(val).data('lzdate-param')._onSelect = fn;

			})

		}

		return this;

	}

	$.fn.dateTool = function(){

		var me = $(this);

		return new tool(me);

	}

	$.fn.lzdate = function(a,b,c,d){

		var me = $(this);

		$.each(me,function(index,val){

			var newDate = new dateInit(val,a,b,c,d);

			val.dateexcute = new dateMethods(val);

			newDate.layout();

			newDate.initEvent();

		})

		return me.dateTool();

	}

})(jQuery)