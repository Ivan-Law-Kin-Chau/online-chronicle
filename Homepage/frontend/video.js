class CustomVideo extends CustomMedia {
	connectedCallback() {
		var customElement = this;
		customElement.style.display = "none";
		
		var shadow = this.shadow;
		
		if (this.mediaObject.loaded === false) {
			this.mediaObject.loaded = true;
			
			shadow.innerHTML += '<link rel="stylesheet" href="/main.css">';
			shadow.innerHTML += '<video src="' + this.getAttribute("src") + '"></video><br style="display: initial;">';
			shadow.innerHTML += '<button class="iconed" disabled><img style="display: none;" src="' + customElement.mediaObject.icon1.src + '"><img style="display: none;" src="' + customElement.mediaObject.icon2.src + '"></button>';
			shadow.innerHTML += '<input type="range" min="0" max="100" value="0">';
			shadow.innerHTML += '<span class="aligned"></span><span class="aligned"> Loading... </span><span class="aligned"></span>';
			
			this.mediaObject.video = shadow.childNodes[1];
			customElement.toggleIcons(1);
			customElement.renderHandler();
			
			shadow.childNodes[1].preload = "metadata";
			shadow.childNodes[1].onloadedmetadata = function () {
				shadow.childNodes[3].disabled = false;
				shadow.childNodes[6].innerHTML = " ";
				shadow.childNodes[1].onended = function () {
					customElement.toggleIcons(1);
				}
				shadow.childNodes[3].onclick = function () {
					if (customElement.mediaObject.video.paused) {
						customElement.mediaObject.video.play();
						customElement.toggleIcons(2);
					} else {
						customElement.mediaObject.video.pause();
						customElement.toggleIcons(1);
					}
				}
				shadow.childNodes[4].oninput = function () {
					shadow.childNodes[1].currentTime = shadow.childNodes[1].duration * (shadow.childNodes[4].value / 100);
				}
				customElement.mediaObject.interval = setInterval(function() {
					shadow.childNodes[5].innerHTML = customElement.toMinSec(shadow.childNodes[1].currentTime);
					if (shadow.childNodes[1].duration) {
						shadow.childNodes[4].value = (shadow.childNodes[1].currentTime / shadow.childNodes[1].duration) * 100;
					}
				}, 41.67);
				shadow.childNodes[6].innerHTML = " / ";
				shadow.childNodes[7].innerHTML = customElement.toMinSec(customElement.mediaObject.video.duration);
			}
		} else {
			customElement.mediaObject.video.pause();
			customElement.toggleIcons(1);
			customElement.renderHandler();
		}
	}
}

customElements.define("custom-video", CustomVideo);