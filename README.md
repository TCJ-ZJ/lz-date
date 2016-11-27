## lz-date使用手册
**当前版本： V1.0.0**

### lz-date是什么
>lz-scroll是一款基于jQuery库开发的轻量级日期选择器插件，方便开发者能够通过点击选择日期。可以设置选择日期的范围，选择日期后的回调函数。当前版本为正式版1.0.0

### 具体参数列表

| 参数名称 | 参数变量 | 参数取值 | 参数说明 |
|-----------|------------|------------|------------|
| 最小可选日期          |`smDate`        |'[yyyy-mm-dd]' / '[yyyy/mm/dd]'   |控制日期选择器最小可以选择的日期，参数为空时：默认值为 *1970-01-01*
| 最大可选日期          |`lgDate`     |'[yyyy-mm-dd]' / '[yyyy/mm/dd]'  |控制日期选择器最大可以选择的日期，参数为空时：默认值为 *2020-12-31*
| 今日选择状态          |`today`      |[true] / [false]|设置是否将今日在日期选择器中显示为'今天'，参数为空时： 默认值为 *true*
| 回调函数         |`fn`   |[function]  |控制当点击选择日期后的回调函数，本参数为空时：默认值为 *null*


### 引入库文件
--此插件基于jQuery开发
```HTML
<script src="js/jquery-11.1.1.min.js"></script>
<script src="js/lz-date.1.0.0.min.js"></script>
<link href="css/lz-date.css" rel="stylesheet" type="text/css">
```	

### 调用插件
--参数可为空，全部参数请参考列表；可多次调用
```html
	<!-- 使用html5 data属性进行传参,优先级大于js传参 -->
	
	<div id="date" data-date-param='{"smDate":"2000-01-01","today":false}'></div>
```

```javascript
<script type="javascript">
    <!--
    	$('#lzdate1').lzdate('2010-01-01','2018-01-01',false,fn) //最小可选日期 最大可选日期 今日显示 回调函数 
		$('#lzdate2').lzdate(true) //今日显示
		$('#lzdate3').lzdate(fn) //回调函数

        /* 或使用对象传参 */

        $('#lzdate4').lzdate({
            smDate : '1970-01-01' ,
            lgDate : '2020-01-01' ,
            today : true 
        },fn)
    -->
</script>
```

### 提供的css选择器
--自定义样式时请带上外层父级id，避免同一页面多个组件样式冲突
```css
.lzdate-box        //日期选择器盒子
.lzdate-header     //日期选择器头部
.lzdate-weeks      //日期选择器星期盒子
.lzdate-days	   //日期选择日期盒子	
.lzdate-prev-year  //日期选择器向前一年按钮
.lzdate-next-year  //日期选择器向后一年按钮
.lzdate-prev-month //日期选择器向前一月按钮
.lzdate-next-month //日期选择器向后一月按钮
.lzdate-main       //日期年份月份显示盒子
.lzdate-today      //日期当天表示样式
.lzdate-disable    //日期不可选样式
```

### 提供的外部调用函数

**调用接口**
```javascript
/*调用接口时，请使用需要改变日期可选范围的input*/
$('#date1').dateTool().setSmDate(str);
$('#date2').dateTool().setLgDate(str);

/*示例：两个input日期选择器相互影响*/

$('#date1').lzdate({
		smDate:'2010-9-21',
		lgDate : '2016-12-21'
		},function(){
			$('#date2').dateTool().setSmDate($("#date1").val());
		});
$('#date2').lzdate({
		smDate:'2010-9-21',
		lgDate : '2016-12-21'
		},function(){
			$('#date1').dateTool().setLgDate($("#date2").val());
		});

```

© 本手册由 磨盘兄弟 @lzmoop 官方提供 www.lzmoop.com
