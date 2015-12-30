# yTags
---
## ReadMe
---
yeTags是一个基于jQuery的tags选择器插件,可以方便的根据需求创建/使用tags标签.
UI基于Semantic-UI创建
	
### 依赖
---
	- jQuery
	- Semantic-UI

### 使用
---
	$(selector).tags();

### 详细用法
---

#### 创建一个最基本的tags选择器
	$(selector).tags({
		tags: {
			{
				tagID: tag id(本地如果留空将按顺序排列)
				tagName: tag name
				tagColoe: tag 颜色
			}
		}        
	});
#### 从服务器获取tags
*存在server参数的情况下会无视 tags 参数中的内容*

	$(selector).tags({
		server: string, 获取tags 的接口地址
	});
	
	{server}要求: 
		- GET请求
		- 返回值包含:
			- status: string, 请求状态"success"/"failed"
			- data:Array(Object), 包含返回的数据
				{
					tagID: tag 数据库id
					tagName: tag name
					tagColoe: tag 颜色
				}
#### 允许新增tags
	$(selectror).tags({
		add: {
			addable: bool, 是否允许新增tag,
			server: string, 接口地址,
			method: string("POST"), 接口调用模式, "POST"/"GET"
		}
	});
	
	发送数据: string, json格式的tag内容, 一般情况下一次只会发送一条
		- name: string, tag名
		- color: string, 颜色名,随机生成
	要求返回:
		- status: string, 请求状态"success"/"failed"
		- data: Object, 包含返回的数据(新增tag的实际序号及tag名)
			- tagID: tag 数据库中保存的id
			- tagName: tag name
			- tagColoe: tag 颜色
#### 允许搜索
	$(selector).tags({
		search: bool(false), 是否允许搜索
	})
#### 额外的个性化设置
	$(selector).tags({
		text: string, 显示的文字
		icon: string, 显示的图标名
		description: string, 显示于菜单header中的描述
	});