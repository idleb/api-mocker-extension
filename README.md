# api-mocker-extension
Transfer API docs to Mock.js

### 安装

安装Chrome插件（src.crx文件）后，在wiki文档页面 http://172.16.10.43:8090 ，插件显示可用

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190626-155735.png)

### 使用

页面Table上方显示“Mock示例”按钮

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190626-155818.png)

点击按钮想显示Mockjs代码片段

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190723-163327.png)

**Mock.js选项：** 显示Mock示例

**Data选项：** 显示生成数据

### 选项设置

模版定义：自定义类型映射关系

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190723-164355.png)

占位符定义：定义数组长度、整数长度和浮点数精度取值范围

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190723-165104.png)

关键字匹配：通过正则匹配关键字映射，例如：添加设置`\S+Id` -> `@id`，`teacherId`值为`@id`

![](https://blog-1257861028.cos.ap-beijing.myqcloud.com/assets/WX20190723-165617.png)
