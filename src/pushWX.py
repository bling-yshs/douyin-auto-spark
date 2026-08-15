# pip install serverchan-sdk
from serverchan_sdk import sc_send
import os
import time

now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
link = os.getenv("LINK")

response = sc_send(
    os.getenv("FTQQ_SENDKEY"),
    "自动火花出错",
    f"失败时间: {now}，请检查 GitHub Actions 日志：{link}",
    {"tags": "火花"}
)
print(response)