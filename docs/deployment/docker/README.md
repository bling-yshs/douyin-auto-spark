# Docker 部署

Docker 镜像已内置 Playwright 运行环境，适合在已有 Docker 的服务器上执行单次续火任务。

## 1️⃣ 准备 Cookie 文件

将 Cookie-Editor 导出的完整 JSON 数组保存到服务器文件，例如：

```text
/root/main/douyin-cookies.json
```

## 2️⃣ 启动容器

在 Linux 或 macOS 终端执行下面的命令，将 `DOUYIN_TARGET_NAMES` 替换为需要续火的好友名称 JSON 数组：

```bash
docker run --rm -e DOUYIN_COOKIE="$(cat /root/main/douyin-cookies.json)" -e DOUYIN_TARGET_NAMES='["这里填好友备注名"]' docker.cnb.cool/bling-team/douyin-auto-spark:latest
```

`DOUYIN_COOKIE` 会读取指定文件的全部内容，多个好友请将 `DOUYIN_TARGET_NAMES` 写成合法 JSON 数组，例如 `["好友A","好友B"]`。

其他配置通过追加 `-e` 传入，例如：

```bash
docker run --rm \
  -e DOUYIN_COOKIE="$(cat /root/main/douyin-cookies.json)" \
  -e DOUYIN_TARGET_NAMES='["别遇测试"]' \
  -e YIYAN_INCLUDE_SOURCE=false \
  docker.cnb.cool/bling-team/douyin-auto-spark:latest
```

更多配置项请查看主页的 [通用配置](../../../README.md#common-config)。

## 3️⃣ 配合定时任务运行

上面的命令每次启动容器后执行一次续火任务。可以将它交给服务器上的定时任务重复执行，具体定时任务的配置方式请根据服务器操作系统和管理面板查阅对应文档。
