# GitHub Actions 部署

GitHub Actions 适合让 GitHub 托管续火任务。配置完成后，工作流会按计划运行，也可以从 Actions 页面手动触发。

## 1️⃣ Fork 项目

点击 GitHub 页面右上角的 `Fork`，将项目复制到自己的 GitHub 账号下。

![fork](../../../assets/readme/fork.jpg)

Fork 后进入自己的仓库，例如：

```text
https://github.com/你的用户名/douyin-auto-spark
```

## 2️⃣ 配置 Secrets

进入仓库：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

![add-secret](../../../assets/readme/add-secret.jpg)

添加基础配置：

| Secret | 必填 | 说明 |
|:---|:---:|:---|
| `DOUYIN_COOKIE` | ✅ | Cookie-Editor 导出的完整 Cookie JSON 数组 |
| `DOUYIN_TARGET_NAMES` | ✅ | 需要续火的好友名称 JSON 数组，例如 `["暮邵落白"]`，建议填写抖音备注名 |
| `YIYAN_INCLUDE_SOURCE` | ❌ | 是否携带一言出处，默认开启；设置为 `false` 时只发送一言正文 |
| `SPARK_MESSAGE_TEMPLATE` | ❌ | 自定义火花消息模板，详见主页的「✉️ 自定义消息模板」 |

邮件通知和多账号配置按主页中的通用说明添加对应 Secrets：

- 邮件通知：`MAIL_ADDRESS`、`MAIL_USERNAME`、`MAIL_PASSWORD`，以及可选的邮件参数。
- 多账号：`DOUYIN_ACCOUNTS_1` 到 `DOUYIN_ACCOUNTS_10`，也兼容历史变量 `DOUYIN_ACCOUNTS`。

## 3️⃣ 手动运行一次

打开仓库的 `Actions` 页面，按 GitHub 页面提示启用工作流，然后选择 `🚀 续一次火`，点击 `Run workflow`。

![run-workflow](../../../assets/readme/run-workflow.jpg)

等待任务完成后，可以打开抖音聊天页确认消息是否发送成功。

## 4️⃣ 自动运行

工作流每天按北京时间 00:00、02:00、04:00 触发。同一天已有成功运行时，后续触发会自动跳过
