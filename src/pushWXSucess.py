# pip install serverchan-sdk
from serverchan_sdk import sc_send
import os
import time

now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
link = os.getenv("LINK")

response = sc_send(
    os.getenv("FTQQ_SENDKEY"),
    "自动火花成功",
    f"提交时间: {now}",
    {"tags": "火花"}
)
print(response)