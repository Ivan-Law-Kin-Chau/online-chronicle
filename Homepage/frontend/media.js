class CustomMedia extends HTMLElement {
	constructor() {
		super();
		this.mediaObject = {};
		this.mediaObject.loaded = false;
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
	
	toggleIcons(icon) {
		var customElement = this;
		var shadow = this.shadow;
		
		if (icon === 1) {
			shadow.childNodes[3].childNodes[0].style.display = "initial";
			shadow.childNodes[3].childNodes[1].style.display = "none";
		} else if (icon === 2) {
			shadow.childNodes[3].childNodes[0].style.display = "none";
			shadow.childNodes[3].childNodes[1].style.display = "initial";
		}
	}
	
	// When the custom element is rendered on the screen by Vue, 
	// there would be a short period of time when it is rendered without the CSS from main.css. 
	// This is a hack to make the custom element hidden until it has been rendered with the CSS from main.css
	renderHandler() {
		var customElement = this;
		var shadow = this.shadow;
		
		let interval = setInterval(function () {
			// If the slider element has been rendered with the CSS from main.css, 
			// its size will become different, which will be detected below
			customElement.style.display = "initial";
			if (shadow.childNodes[4].offsetWidth > 145) {
				clearInterval(interval);
			} else {
				customElement.style.display = "none";
			}
		}, 41.67);
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
}