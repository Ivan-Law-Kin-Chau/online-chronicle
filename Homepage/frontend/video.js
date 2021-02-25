class CustomVideo extends HTMLElement {
	constructor() {
		super();
		this.mediaObject = {};
		this.shadow = this.attachShadow({
			"mode": "open"
		});
		
		// Preload the icons that will be used
		this.mediaObject.icon1 = new Image();
		this.mediaObject.icon1.src = "https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/svg/media-play.svg";
		this.mediaObject.icon1.onerror = () => {
			this.mediaObject.icon1.src = "/libraries/open-iconic/svg/media-play.svg";
		}
		
		this.mediaObject.icon2 = new Image();
		this.mediaObject.icon2.src = "https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/svg/media-pause.svg";
		this.mediaObject.icon2.onerror = () => {
			this.mediaObject.icon2.src = "/libraries/open-iconic/svg/media-pause.svg";
		}
	}
	
	connectedCallback() {
		this.fetchVideo().catch(function (error) {
			console.log(error);
		});
		var customElement = this;
		var shadow = this.shadow;
		shadow.innerHTML += '<video></video><br style="display: initial;">';
		shadow.innerHTML += '<button class="iconed" disabled><img src="' + customElement.mediaObject.icon1.src + '"></button>';
		shadow.innerHTML += '<div id="slider1"><div style="width: 0%; height: 100%; background-color: #00FF00;"></div></div>';
		shadow.innerHTML += '<input id="slider2" type="range" min="0" max="100" value="0" style="display: none;">';
		shadow.innerHTML += '<span class="aligned"></span><span class="aligned"> Loading... </span><span class="aligned"></span>';
		shadow.innerHTML += '<style> @import "main.css"; </style>';
		this.mediaObject.video = shadow.childNodes[0];
	}
	
	toMinSec(time) {
		const minute = (time / 60) - ((time / 60) % 1);
		const second = (time % 60) - (time % 1);
		if (!isNaN(minute) && !isNaN(second)) {
			if (second < 10) {
				return minute + ":0" + second;
			} else {
				return minute + ":" + second;
			}
		} else {
			return null;
		}
	}
	
	async fetchVideo() {
		var customElement = this;
		var shadow = this.shadow;
		const requestOptions = {
			"headers": {
				"Bypass-Tunnel-Reminder": "1"
			}
		};
		this.mediaObject.array = [];
		return fetch(host + this.getAttribute("src"), requestOptions).then(function process (response) {
			if (!response.ok) throw new Error(response.status + " (" + response.statusText + ")");
			customElement.mediaObject.total = parseInt(response.headers.get("Content-Length"));
			var reader = response.body.getReader();
			return reader.read().then(function processResult(result) {
				// console.log(result);
				if (result.done) {
					// console.log("Fetch complete");
					shadow.childNodes[0].preload = "metadata";
					shadow.childNodes[0].src = customElement.mediaObject.url;
					shadow.childNodes[0].onloadedmetadata = function () {
						shadow.childNodes[2].disabled = false;
						shadow.childNodes[3].style.display = "none";
						shadow.childNodes[4].style.display = "initial";
						shadow.childNodes[6].innerHTML = " ";
						shadow.childNodes[0].onended = function () {
							shadow.childNodes[2].childNodes[0].src = customElement.mediaObject.icon1.src;
						}
						shadow.childNodes[2].onclick = function () {
							if (customElement.mediaObject.video.paused) {
								customElement.mediaObject.video.play();
								shadow.childNodes[2].childNodes[0].src = customElement.mediaObject.icon2.src;
							} else {
								customElement.mediaObject.video.pause();
								shadow.childNodes[2].childNodes[0].src = customElement.mediaObject.icon1.src;
							}
						}
						shadow.childNodes[4].oninput = function () {
							shadow.childNodes[0].currentTime = shadow.childNodes[0].duration * (shadow.childNodes[4].value / 100);
						}
						customElement.mediaObject.interval = setInterval(function() {
							shadow.childNodes[5].innerHTML = customElement.toMinSec(shadow.childNodes[0].currentTime);
							if (shadow.childNodes[0].duration) {
								shadow.childNodes[4].value = (shadow.childNodes[0].currentTime / shadow.childNodes[0].duration) * 100;
							}
						}, 41.67);
						shadow.childNodes[6].innerHTML = " / ";
						shadow.childNodes[7].innerHTML = customElement.toMinSec(customElement.mediaObject.video.duration);
					}
					return;
				} else {
					customElement.mediaObject.array = new Uint8Array([...customElement.mediaObject.array, ...result.value]);
				}
				var blob = new Blob([customElement.mediaObject.array]);
				var loaded = blob.size / customElement.mediaObject.total * 100;
				loaded -= loaded % 1;
				if (!isNaN(loaded)) {
					shadow.childNodes[3].childNodes[0].style.width = loaded + "%";
					shadow.childNodes[3].childNodes[0].style.borderRight = "1px solid #000000";
					shadow.childNodes[6].innerHTML = "Loading... " + loaded + "%";
				}
				customElement.mediaObject.url = window.URL.createObjectURL(blob);
				// console.log(customElement.mediaObject.url);
				return reader.read().then(processResult);
			});
		});
	}
}

customElements.define("custom-video", CustomVideo);