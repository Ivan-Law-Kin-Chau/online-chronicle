# InfinityFree and Localtunnel

## Problem Solved

You want to host a website for free, with your own computer as the server. However, you do not have access to the router. Localtunnel sounds like the best solution for you, but you want a guaranteed subdomain and you do not want to see the Friendly Reminder. If this describes your situation, this solution is for you. 

## How It Works

InfinityFree is the front-end. Whenever a user accesses InfinityFree, InfinityFree sends an HTTP request to the Localtunnel subdomain, which allowes the backend to process the request and return a response. Localtunnel then sends the response to InfinityFree, which then returns it again. This solves two problems in the same time. First, InfinityFree can keep track of which Localtunnel subdomain is being used, so that the same subdomain (the InfinityFree subdomain, not the Localtunnel subdomain) will always return your website. Second, InfinityFree can send the custom HTTP headers required to bypass the Friendly Reminder at every single HTTP request, removing the Friendly Reminder. 

## Directory Structure

```
├───Framework - The things needed to set up InfinityFree and Localtunnel
│	└───htdocs - The files to be hosted at InfinityFree
└───Homepage - Put the website that you want to host here
	├───backend - The server-side scripts for the website
	└───frontend - The client-side files of the website
```

## Instructions

1. Make an account at InfinityFree. 
2. Upload everything in the **Framework\htdocs** folder with the File Manager at InfinityFree. 
3. Go to CPanel at InfinityFree and set the Error Pages just like how it is in the image **errorPages.png**. Replace **cingjue.rf.gd** with the subdomain you chose for your InfinityFree account. 
4. Go to **Framework\server.js** and replace any mentions of **cingjue** and **cingjue.rf.gd** with your chosen subdomain. 
5. Change the variable **viewPort** in **Framework\server.js** to the port where your website is being hosted. 
6. Run **start.bat** to start your server. 

## Limitations

- **Multiple points of failure.** You are basically doomed if either InfinityFree or Localtunnel are unhappy about what we are doing. 
- **The website is unscalable.** Localtunnel does not allow more than ten connections to your website in the same time. 
- **You cannot upgrade protocols.** Having to add custom headers to all HTTP requests prevents protocol upgrades from being possible. 

## Frequently Asked Questions

1. How can I use Websockets? 

	Websockets require protocol upgrades to work, so you cannot. But you can use Socket.IO. Look at **Homepage\backend\server.js** (for the server-side) and **Homepage\frontend\client.js** (for the client-side) for an example of Socket.IO being used. 

2. How can I use HTML5 audio/video tags? 

	HTML5 audio/video tags require protocol upgrades to work, so you cannot. But you can use the fetch API to add custom headers to all HTTP requests to load the audio/video and use JavaScript to render it into the DOM. Look at **Homepage\frontend\audio.js** (for audio) and **Homepage\frontend\video.js** (for video) for an example of how can this work, rendered inside the shadow DOM of custom elements that can be used similarly to HTML5 audio/video tags. 

3. How can I optimize the performance of InfinityFree and Localtunnel? 

	Instead of having to go through both InfinityFree and Localtunnel for every single HTTP request made when loading the same page, you can bet that the Localtunnel subdomain used will not change during the short period of time required for a user to load that page. Then, you can add a short snippet of JavaScript into the page that is being loaded to access **localtunnel.txt** in the root directory of the InfinityFree subdomain you are using. The **localtunnel.txt** tells JavaScript the current Localtunnel subdomain, and JavaScript store it as a variable. Afterwards, you can send the rest of the HTTP requests for loading the page towards that Localtunnel subdomain directly by adding the needed custom headers to all HTTP requests through the fetch API. This way, these HTTP requests will only have to get through Localtunnel, instead of both InfinityFree and Localtunnel, reducing the overhead. Look at **Homepage\frontend\index.js** for an example of this being done. 

4. Why is there a **localtunnel.txt** in the **Homepage\frontend** directory? 

	Sometimes, I would like to test the website on localhost instead of on the InfinityFree subdomain, but then the website will still send HTTP requests to get the current Localtunnel subdomain being used. However, the **localtunnel.txt** was on the InfinityFree subdomain, not on localhost, so this HTTP request throws an 404 error. Adding a **localtunnel.txt** to the **Homepage\frontend** directory solves this problem. However, feel free to remove the **localtunnel.txt** if you are not going to test the website on localhost. 