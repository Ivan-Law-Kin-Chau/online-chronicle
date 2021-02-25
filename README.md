# Online Chronicle

## What's New

The InfinityFree and Localtunnel technology stack that was used in the previous version, Pre-Alpha v0.1.0, had been abandoned in favour of a paid, arbeit cheap, option. Just like in the previous version, this website is hosted with my own computer as the server. However, unlike the previous website, instead of relying on InfinityFree for a guaranteed subdomain and Localtunnel for the tunneling, Dot TK is used to provide an actual domain and Vultr is used to host my own Localtunnel Server. This change achieves two purposes: 

1. Using Dot TK instead of InfinityFree reduces the overhead of running this website and boosts its performance significantly because Dot TK uses actual DNS that points to the public IP from Vultr, while InfinityFree has to manually handle each HTTP request by running a PHP script and waiting for sockets
2. Using my own Localtunnel Server instead of the official one removes the limitation of having to add custom headers to all HTTP requests, which significantly increases the amount of things that this website can do smoothy without errors, such as Websockets and HTML5 audio/video tags

## Design Decisions

1. Vultr vs RamNode

	After searching for cheap web hosting, I ended up with two options - Vultr and RamNode. RamNode (which costs 3 dollars per month) is cheaper than Vultr (which costs 5 dollars per month), and I also saw anecdotes that say RamNode has really good customer service. However, RamNode does not have any servers that are near me, while Vultr has. I tried out both of them and did a simple benchmarking to see which one can load up the same website faster. Turns out that Vultr is significantly faster than RamNode. This might be because Vultr's server is much closer to me than RamNode's, but I am not sure. In order to optimize the performance of my website, I therefore decided to use Vultr instead of RamNode in the end. 

2. Localtunnel vs Pagekite

	During the development of this release, I realized that Localtunnel is not the only open source tunneling server around that I can self-host. Pagekite provides similar capabilities, and I really liked to give it a try because they have a beautiful value statement on their Freedom & Privacy page, and their website looks more beautiful than Localtunnel's website. I am able to get **pagekite.py** running on the server just like **localtunnel-server**, then I did a simple benchmarking. However, this revealed that **localtunnel-server** is significantly faster than **pagekite.py**. Therefore, I decided to continue using Localtunnel in the end, instead of switching to Pagekite. However, if you have more powerful servers that can overcome this limitation, I seriously recommend you to give Pagekite a try to help out our fellow freedom-loving people. 

## Technologies Used

Back-end: 
- SSH
- PuTTY
- Node.js

Front-end: 
- Socket.IO
- Vue.js

## Directory Structure

```
├───Framework - PuTTY scripts used for server maintainence
└───Homepage - The website that I am hosting with the server
	├───backend - The server-side scripts for the website
	└───frontend - The client-side files of the website
```

## Instructions

1. Make a copy of **Framework\variables (template).txt** and rename it as **variables.txt**. 
2. Create an instance in Vultr. Use the information provided to fill in the blanks at **Framework\variables.txt**. If you do not know what is your username or port, usually your username would be **root** and your port would be **22**. 
3. Install PuTTY and edit all the Batch files at the **Framework** directory to correct the paths to the PuTTY executable if nessesary. 
4. Register your domain at Dot TK and add two DNS records, both pointing to your Vultr public IP address, with one being an A record for just the domain and the other being an A record for the subdomain that you will use for Localtunnel. 
5. Install Localtunnel globaly and open **Framework\start.bat** to replace the domain and subdomain there with the Dot TK domain and Localtunnel subdomain that you chose in the previous step. 
6. To install the server, run **Framework\install.bat**. 
7. To start the server, run **Framework\start.bat**. 
8. To reboot the server, run **Framework\reboot.bat**. 