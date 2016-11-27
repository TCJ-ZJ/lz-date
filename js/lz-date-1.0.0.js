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

/*！
* 定义构造函数--事件函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法设置事件函数 
*/

	// 创建一个构造函数	

	var dateEvent = function(val){

		// 初始化各类参数

		this.$ele = $(val);

		this.param = this.$ele.data("date-param");

		this.status = this.$ele.data("date-status");

		this.box = this.$ele.data("date-box");

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

	// 定义点击input框后显示日期选择器的事件函数

	dateEvent.prototype.display = function(){

		// 初始化各类参数

		var me = this.$ele,

		self = me.get(0),

		status = this.status,

		box = this.box;

		// 添加input的点击事件

		me.on('click', function(e) {

			e.stopPropagation();

			// 调用位置函数
			
			self.dateexcute.setPosition();

			// 调用设置年和月的函数

			self.dateexcute.setDate();

			// 调用设置天的函数

			self.dateexcute.setDays();

			// 将所有日期选择器隐藏

			$('.lzdate-box').css('display','none')

			// 显示对应的日期选择器

			box.css('display','block');

		});

		// 点击日期选择器内部元素时不冒泡

		box.on('click', function(e) {
			
			e.stopPropagation();

		});

		// 点击document隐藏所有日期选择器

		$(document).on('click', function(e) {

			e.preventDefault();
			
			var target = e.target || e.srcElement;

			$('.lzdate-box').css('display','none');

		});

	}

	// 定义年份和月份切换的点击事件

	dateEvent.prototype.change =  function(){

		// 初始化各类参数

		var me = this.$ele,

		self = me.get(0),

		box = this.box,

		status = this.status;

		// 添加点击事件

		box.find('.lzdate-header').on('click', function(e) {

			e.preventDefault();
			
			var target = e.target||e.srcElement;

			if(target.nodeName.toLowerCase()==="p"){

				// 如果点击的是向前一年，则将年份减去1

				if($(target).hasClass('lzdate-prev-year')){

					status.year -= 1;

				// 如果点击的是向一月，则将月份减去1

				}else if($(target).hasClass('lzdate-prev-month')){

					status.month -= 1;

				// 如果点击的是向后一年，则将年份加上1

				}else if($(target).hasClass('lzdate-next-year')){

					status.year += 1;

				// 如果点击的是向上一月，则将月份加上1

				}else if($(target).hasClass('lzdate-next-month')){

					status.month += 1;

				}

				// 如果月份等于0，则将年份减去1并将月份设置为12

				if(status.month==0){

					status.year -= 1;

					status.month =12;

				// 如果月份大于12，则将年份加上1并将月份设置为1

				}else if(status.month>12){

					status.year += 1;

					status.month = 1;

				}

				// 调用设置年月日的函数重新布局

				self.dateexcute.setDate();

				self.dateexcute.setDays();

			}

		});

	}

	// 定义点击日期将其赋值到input中的事件

	dateEvent.prototype.value = function(){

		// 初始化各类参数

		var me = this.$ele,

		self = me.get(0),

		box = this.box,

		param = this.param,

		status = this.status;

		// 添加点击特定日的事件

		box.find('.lzdate-days').on('click', function(e) {

			e.preventDefault();
			
			var target = e.target || e.srcElement;

			if(target.nodeName.toLowerCase()==='li'){

				// 如果点击日期不在可选范围内，则不做操作

				if($(target).hasClass('lzdate-disable')){

					return false;

				}else{

					// 如果点击的是今天则将今天转化为相应的数字

					var day = $(target).html()=='今天'?status.cDay:$(target).html();

					me.val(status.year+'-'+status.month+'-'+day)

					box.css('display','none');

					// 调用回调函数

					if(param.fn){

						param.fn();

					}

				}

			}
		});

	}

/*！
* 定义构造函数--执行函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法：滚动条和内容高度的计算，并进行滚动操作
*/

	// 创建构造函数

	var dateMethods = function(val){

		// 初始化各类参数

		this.$ele = $(val);

		this.param = this.$ele.data('date-param');

		this.status = this.$ele.data('date-status');

	}

	// 设置日期选择器的位置

	dateMethods.prototype.setPosition = function(){

		var me = this.$ele,

		box = me.data('date-box');

		box.css({

			top: me.offset().top+me.height()+6,

			left : me.offset().left
		})

	}

	// 设置日期选择器当前显示的年份和月份

	dateMethods.prototype.setDate = function(){

		// 初始化各类参数

		var me = this.$ele,

		status = this.status,

		box = me.data('date-box');

		box.find('.lzdate-main').find('span').eq(0).html(status.year);

		box.find('.lzdate-main').find('span').eq(1).html(status.month);

	}

	// 设置日期选择器当前显示的日期

	dateMethods.prototype.setDays = function(){

		// 初始化各类参数

		var me = this.$ele,

		param = this.param,

		status = this.status,

		box = me.data('date-box'),

		elem = null;

		// 获得当前年份月份下的天数

		var daysNum = $.getDays(status.year,status.month),

		// 获得当前年份月份下第一天的星期数

		weekNum = $.getWeek(status.year,status.month);

		var days = document.createDocumentFragment();

		for(var i =1;i<=daysNum;i++){

			// 如果当前日期与真是日期相符，并且设置了当前参数显示今天

			if(status.year === status.cYear && status.month === status.cMonth && status.cDay ===i && param.today){

				elem = $('<li>今天</li>').addClass('lzdate-today');

			}else{

				elem = $('<li>'+i+'</li>');

			}

			// 是否在设置的可选范围内

			var flagsm = status.year>status.smYear || (status.year == status.smYear && status.month>status.smMonth) || (status.year == status.smYear && status.month==status.smMonth && i >= status.smDay);

			var flaglg = status.year<status.lgYear || (status.year==status.lgYear && status.month<status.lgMonth) || (status.year==status.lgYear && status.month==status.lgMonth && i<= status.lgDay);

			// 不在范围内的元素添加disable

			if(!flaglg || !flagsm){

				elem.addClass('lzdate-disable');

			}

			$(days).append(elem);
			
		};

		box.find('.lzdate-days').html(days);

		box.find('.lzdate-days li').eq(0).css('marginLeft',weekNum*32);

	}

/*！
* 定义构造函数--初始化函数
*
* 初始化该对象上的各类参数
*
* 设置各类prototype的方法：包括初始化参数，初始化事件，初始化布局
*/

	var dateInit = function(val,a,b,c,d){

		// 初始化对象上的参数

		this.$ele = $(val);

		// 参数

		this.$ele.data('date-param',this.initParam(a,b,c,d));

		// 执行状态

		this.$ele.data('date-status',{
			boxid : null,
			dateBox : null,
			now : null,
			cYear : null,
			cMonth : null,
			cDay : null,
			smYear : null,
			smMonth : null,
			smDay : null,
			lgYear : null,
			lgMonth : null,
			lgDay : null,
			year : null,
			month : null,
			selectYear : null,
			selectMonth : null,
			selectDay : null,
			selectDate : null,
			mouseH:false
		})

	}

	// 初始化页面布局

	dateInit.prototype.layout = function(){

		// 初始化各类参数

		var me = this.$ele,

		param = me.data('date-param'),

		status = me.data('date-status');

		me.attr("readonly", "readonly");

		var date = new Date();

		status.now = date;

		status.cYear =  date.getFullYear();

		status.cMonth = date.getMonth()+1;

		status.cDay = date.getDate();

		status.year =  date.getFullYear();

		status.month = date.getMonth()+1;

		var smDate = $.formateDate(param.smDate);

		var lgDate = $.formateDate(param.lgDate);

		status.smYear = smDate[1]-0;

		status.smMonth = smDate[2]-0;

		status.smDay = smDate[3]-0;

		status.lgYear = lgDate[1]-0;

		status.lgMonth = lgDate[2]-0;
		
		status.lgDay = lgDate[3]-0;

		status.boxid = 'lzbox-'+(count++);

		// 初始布局日期选择器

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
		
		me.data('date-box',$('#'+status.boxid));
	}

	// 初始化事件函数

	dateInit.prototype.initEvent = function(){

		// 初始化各类参数

		var me = this.$ele,

		status = me.data('date-status'),

		box = me.data('date-box');

		event = new dateEvent(me);

		event.setEvent();

	}

	// 初始化各项参数	

	dateInit.prototype.initParam = function(a,b,c,d){

		var param = {

			// 最小可选日期

			smDate : '1970-01-01',

			// 最大可选日期

			lgDate : '2020-12-31',

			// 是否将今天显示为‘今天’

			today : true,

			// 事件参数

			// 非传参参数

			event : ['display','change','value'],

			// 点击日期选择后的回调函数

			fn: null

		}

		if($.isObject(a)){

			param = $.extend({},param,a);

			param.fn = b;

		}else{

			param.smDate = a;

			param.lgDate = b;

			param.today = c;

			param.fn = d;

		}

		typeof a ==='boolean' && (param.today = a);

		typeof a ==='function' &&(param.fn = a);

		if(this.$ele.data('date-param')){

			param = $.extend({},param,this.$ele.data('date-param'));

		}

		!$.isDate(param.smDate) &&　(param.smDate = '1970-01-01');

		!$.isDate(param.lgDate) && (param.lgDate = '2020-12-31');

		param.today = (param.today===false)?false:true;

		param.fn = typeof param.fn =='function'? param.fn : null;

		return param;

	}

/*！
* 在jQuery原型中创建一个对象级方法，用于对外接口，是开发者能够向插件中随意改变最大最小可选日期
*
* var a = obj.bannerTool();  创建一个实例，obj 为当前需要改变的input日期选择器
*
* 新的实例对象a可以调用内部的方法
*/

	$.fn.dateTool = function(){

		// 获得当前元素的jquery对象

		var me = $(this);

		// 定义tool类，包含各种接口函数	

		var tool = {

			self : me,

			param : me.data('date-param'),

			status : me.data('date-status'),

			box : me.data('date-box'),

			// 设置最小可选日期

			setSmDate:function(str){

				if($.isDate(str)){

					var date = $.formateDate(str);

					this.status.smYear = date[1]-0;

					this.status.smMonth = date[2]-0;

					this.status.smDay = date[3]-0;

				}

				return this;

			},

			// 设置最大可选日期

			setLgDate : function(str){

				if($.isDate(str)){

					var date = $.formateDate(str);

					this.status.lgYear = date[1]-0;

					this.status.lgMonth = date[2]-0;

					this.status.lgDay = date[3]-0;

				}

				return this;

			}

		}

		// 返回tool对象

		return tool;

	}

/*！
* 在jQuery原型中创建一个对象级方法，用于调用scroll方法
*/


	$.fn.lzdate = function(a,b,c,d){

		// 将调用对象保保存在变量me中

		// 此处非功能对象而是页面上的元素DOM对象

		var me = $(this);

		// 循环遍历添加date方法

		$.each(me, function(index, val) {
			
			var newDate = new dateInit(val,a,b,c,d);

			val.dateexcute = new dateMethods(val);

			newDate.layout();

			newDate.initEvent();

		});

		return me;

	}

})(jQuery)