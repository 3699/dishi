// 初始化
mui.init();

// 所有的方法都放到这里
mui.plusReady(function(){
	initDb();
	initList();
	
	// index页面的添加事件
	window.addEventListener('addItem', function(event) {
		addItem(event.detail.value);
	});
	
	// tap事件
	window.addEventListener("tap", function(event){
		delItem(event);
	});
});

// 初始化数据库
function initDb(){
	db = qiao.h.db();
//	qiao.h.update(db, 'drop table t_plan_day');
//	qiao.h.update(db, 'drop table t_plan_day_done');
	qiao.h.update(db, 'create table if not exists t_plan_day (id unique, plan_content)');
	qiao.h.update(db, 'create table if not exists t_plan_day_done (id unique, plan_content)');
}

// 初始化待办事项
function initList(){
	var $ul = $('#todolist').empty();
	qiao.h.query(db, 'select * from t_plan_day order by id desc', function(res){
		for (i = 0; i < res.rows.length; i++) {
			$ul.append(genLi(res.rows.item(i)));
		}

		showList($ul);
	});
}
function genLi(data){
	var li = 
		'<li class="mui-table-view-cell">' +
			'<div class="mui-slider-right mui-disabled">' + 
				'<a class="mui-btn mui-btn-green dela" data-id="' + data.id + '" data-content="' + data.plan_content + '">完成</a>' + 
			'</div>' + 
			'<div class="mui-slider-handle">' + 
				data.plan_content + 
			'</div>' + 
		'</li>';
		
	return li;
}
function showList(ul){
	if(ul.find('li').size() > 0 &&  ul.is(':hidden')) ul.show();
}

// 添加待办事项
function addItem(value){
	var $ul = $('#todolist');
	
	if(value){
		qiao.h.query(db, 'select max(id) mid from t_plan_day', function(res){
			var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
			qiao.h.update(db, 'insert into t_plan_day (id, plan_content) values (' + (id+1) + ', "' + value + '")');
			initList();
		});
	}else{
		qiao.h.tip('请填写待办事项内容！');
	}
}

// 删除待办事项
function delItem(event){
	var target = qiao.eventUtil.getTarget(event);
	if(target.className.indexOf('dela') > -1){
		var id = $(target).data('id');
		qiao.h.update(db, 'delete from t_plan_day where id=' + id);
		initList();
		
		var content = $(target).data('content');
		qiao.h.query(db, 'select max(id) mid from t_plan_day_done', function(res){
			var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
			qiao.h.update(db, 'insert into t_plan_day_done (id, plan_content) values (' + (id+1) + ', "' + content + '")');
		});
	}
}