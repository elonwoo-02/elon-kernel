---
title: '在WSL2中安装Ubuntu22.04并配置网络代理'
pubDate: 2022-07-01
description: '在这篇文章中，我将分享我在WSL2中安装Ubuntu22.04并配置网络代理的过程。通过更换APT源和配置局域网代理，我成功地提升了软件包更新速度，并实现了在局域网内的网络访问。希望这篇文章能帮助到需要在WSL2中使用Ubuntu的朋友们。'
author: 'Elon Woo'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["wsl2", "ubuntu", "networking", "proxy"]
likeCount: 7
shareCount: 2
docked: false
---


## 安装WSL2并配置Ubuntu22.04

## 更换APT源

在Ubuntu 系统中，将 APT 源设置为国内镜像源可以提高软件包更新和下载速度，这里以阿里源为例。

### 1. 备份现有的源列表：

```
cd /etc/apt/
ls  // etc/apt/目录有个名为sources.list的文件
sudo cp sources.list sources.list.bak   // 备份
ls  // etc/apt/目录有个名为sources.list.bak的文件
```

### 2. 编辑 sources.list 文件：

使用以下命令打开 sources.list 文件：

```sudo vim sources.list```

### 3. 替换内容为阿里源：

删除文件原有内容

```
dG
````

根据Ubuntu 版本，将内容替换为对应的阿里源。以下是常见版本的源地址：

``` Ubuntu 22.04 (Jammy)
deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
```

``` Ubuntu 20.04 (Focal)
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
```

``` Ubuntu 18.04 (Bionic):
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
```

### 4. 更新软件包索引：

// todo: 解释两个命令的意义
使用以下命令更新软件包索引并更新，定期执行该命令。

```sudo apt update & sudo apt upgrade```


## 令WSL2能够使用宿主机的代理

### 方法一：配置 HTTP(S)/SOCKS 代理

1. 开启Clash的LAN访问。
2. 在Windows防火墙中放行Clash代理端口：设置=>防火墙=>允许应用通过防火墙=>打开Clash相关的专用网。
3. 为WSL2设置代理。


### 方法二：配置镜像代理

这是一种更简便的网络代理方法。WSL2默认使用NAT网络，通过Hyper-V虚拟交换机连接宿主机，网络是隔离的，IP并不相同。

在启用 WSL2 的镜像模式（Mirrored Mode）后，宿主机和WSL2子系统将：

- 共享 IP 地址：WSL2 子系统和宿主机将共享相同的 IP 地址（如 192.168.x.x），实现网络直通。
- 共享网络配置：包括 DNS、路由和代理设置，WSL2 将直接继承宿主机的网络配置。
- 代理继承：通过设置 autoProxy=true，WSL2 可以自动继承宿主机的代理设置，无需手动配置。

1. 启用镜像模式

在Windows根目录编辑.wslconfig文件，如果没有就创建该文件并编辑。

```angular2html
[wsl2]
networkingMode=mirrored
dnsTunneling=true
autoProxy=true

[experimental]
# requires dnsTunneling but are also OPTIONAL
bestEffortDnsParsing=true
```
2. 重启WSL2以使配置生效

```angular2html
wsl --shutdown // 关机后要重启
```

3. 测试网络连通性

```angular2html
 curl -I https://www.google.com
```

由于宿主机和WSL2子系统的网络栈隔离和端口复用，加之操作系统设计了机制来处理共享IP的情况确保网络通信的正常进行，启用镜像模式后，二者共享相同的 IP 地址，但这并不会导致冲突。

此时WSL的IP地址、DNS配置和路由表应与宿主机相同。

```angular2html
ip addr show eth0
cat /etc/resolv.conf
ip route
```

### 方法三：配置 TUN 模式代理

1. 下载服务模式，下载成功后Clash会自动重启。
2. 配置Clash Core使得盾牌变亮。 
3. 开启Clash的TUN模式。 
4. 配置UWP Loopback（需要 Clash 以管理员权限启动）放行 Windows子系统，在打开的界面中勾选Ubuntu22.04、 适用于Linux的Windows子系统后点击Save Change
5. 重启电脑后，WSL2内便全局代理配置成功。


------------------------------------------------------------------------------------------


## 配置局域网代理

使启动clash系统代理的设备作为服务器，为局域网其他设备提供代理服务。


### 准备工作（服务器）

- 允许Clash通过Defender防火墙。
- 打开Clash的允许局域网连接（Allow LAN）和系统代理（System Proxy）。
- 点击Clash的Profiles，编辑启用的.yaml文件，将allow-lan改为true。


### 设置代理（其它设备）

- 其它设备连接到同一局域网中，进入该WI-FI的配置页面。
  - 安卓/苹果手机或平板：WIFI设置；
  - windows：代理服务器设置；
  - WSL2：/etc/resolv.conf；
- 将Clash中显示的服务器IP和Port输入进去。

```
代理（Proxy）：手动（Manual）,
主机名（HostName）：      // 启动系统代理的设备的IP地址
端口（Port）：7890       // 一般是7890，也可以自定义
```

- 测试网络连接。