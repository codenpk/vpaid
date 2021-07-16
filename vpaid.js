var link = 'https://www.orsay.com/';
createOffersExecuted = !1, $offers = document.getElementsByClassName('offer-link'), visibleOffers = 3;

function myCSS(data) {
    var head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
        if (data && data.constructor == Object) {
            for (var k in data) {
                var selector = k;
                var rules = data[k];
                var allSheets = document.styleSheets;
                var cur = null;
                var indexOfPossibleRule = null,
                    indexOfSheet = null;
                for (var i = 0; i < allSheets.length; i++) {
                    indexOfPossibleRule = findIndexOfObjPropInArray("selectorText", selector, allSheets[i].cssRules);
                    if (indexOfPossibleRule != null) {
                        indexOfSheet = i;
                        break
                    }
                }
                var ruleToEdit = null;
                if (indexOfSheet != null) {
                    ruleToEdit = allSheets[indexOfSheet].cssRules[indexOfPossibleRule]
                } else {
                    cur = document.createElement("style");
                    cur.type = "text/css";
                    head.appendChild(cur);
                    cur.sheet.addRule(selector, "");
                    ruleToEdit = cur.sheet.cssRules[0]
                }
                applyCustomCSSruleListToExistingCSSruleList(rules, ruleToEdit, (err) => {})
            }
        }
    }
};

function applyCustomCSSruleListToExistingCSSruleList(customRuleList, existingRuleList, cb) {
    var err = null;
    if (customRuleList && customRuleList.constructor == Object && existingRuleList && existingRuleList.constructor == CSSStyleRule) {
        for (var k in customRuleList) {
            existingRuleList.style[k] = customRuleList[k]
        }
    } else {
        err = ("provide first argument as an object containing the selectors for the keys, and the second argument is the CSSRuleList to modify")
    }
    if (cb) {
        cb(err)
    }
}

function findIndexOfObjPropInArray(objPropKey, objPropValue, arr) {
    var index = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][objPropKey] == objPropValue) {
            index = i;
            break
        }
    }
    return index
}
var VpaidVideoPlayer = function() {
    this.slot_ = null;
    this.videoSlot_ = null;
    this.eventsCallbacks_ = {};
    this.attributes_ = {
        'companions': '',
        'desiredBitrate': 256,
        'duration': 10,
        'expanded': !1,
        'height': 0,
        'icons': '',
        'linear': !0,
        'remainingTime': 10,
        'skippableState': !1,
        'viewMode': 'normal',
        'width': 0,
        'volume': 1.0
    };
    this.quartileEvents_ = [{
        event: 'AdImpression',
        value: 0
    }, {
        event: 'AdVideoStart',
        value: 0
    }, {
        event: 'AdVideoFirstQuartile',
        value: 25
    }, {
        event: 'AdVideoMidpoint',
        value: 50
    }, {
        event: 'AdVideoThirdQuartile',
        value: 75
    }, {
        event: 'AdVideoComplete',
        value: 100
    }];
    this.nextQuartileIndex_ = 0;
    this.parameters_ = {}
};
VpaidVideoPlayer.prototype.handshakeVersion = function(version) {
    return ('2.0')
};
VpaidVideoPlayer.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.attributes_.width = width;
    this.attributes_.height = height;
    this.attributes_.viewMode = viewMode;
    this.attributes_.desiredBitrate = desiredBitrate;
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;
    this.parameters_ = JSON.parse(creativeData.AdParameters);
    window.offers = this.parameters_.offers;
    this.log('initAd ' + width + 'x' + height + ' ' + viewMode + ' ' + desiredBitrate);
    this.updateVideoSlot_();
    this.videoSlot_.addEventListener('timeupdate', this.timeUpdateHandler_.bind(this), !1);
    this.videoSlot_.addEventListener('loadedmetadata', this.loadedMetadata_.bind(this), !1);
    this.videoSlot_.addEventListener('ended', this.stopAd.bind(this), !1);
    this.slot_.addEventListener('click', this.clickAd_.bind(this), !1);
    this.callEvent_('AdLoaded')
};
VpaidVideoPlayer.prototype.clickAd_ = function() {
    if ('AdClickThru' in this.eventsCallbacks_) {
        this.eventsCallbacks_.AdClickThru('', '0', !0)
    }
};
VpaidVideoPlayer.prototype.loadedMetadata_ = function() {
    this.attributes_.duration = this.videoSlot_.duration;
    this.callEvent_('AdDurationChange')
};
var myEvents = [{
    event: 'myAddOffers',
    value: 0,
    do: function() {
        var elem = document.createElement('a');
        var href = document.createAttribute("href");
        var tg = document.createAttribute("target");
        href.value = 'https://www.orsay.com/';
        tg.value = "_blank";
        elem.classList.add("main-link");
        elem.setAttributeNode(href);
        elem.setAttributeNode(tg);
        document.getElementById('slot').appendChild(elem);
    }
}, {
    event: 'myAddOffers',
    value: 23,
    do: function() {
        var container = document.createElement('div');
        container.classList.add('offersContainer');
        document.getElementById('slot').appendChild(container);
        for (var i = 0; i < offers.length; i++) {
            var elem = document.createElement('a');
            var href = document.createAttribute("href");
            var tg = document.createAttribute("target");
            href.value = window.offers[i];
            tg.value = "_blank";
            elem.classList.add("offer-link");
            elem.classList.add("offer-link-" + i);
            elem.setAttributeNode(href);
            elem.setAttributeNode(tg);
            container.appendChild(elem);
        }
    }
}, {
    event: 'myChangeOffer',
    value: 41,
    do: function() {
        $offers[0].remove()
    }
}, {
    event: 'myChangeOffer',
    value: 64,
    do: function() {
        $offers[0].remove()
    }
}, {
    event: 'removeOffers',
    value: 86,
    do: function() {
        document.getElementsByClassName('offersContainer')[0].classList.add('removedOffers')
    }
}, {
    event: 'endVideo',
    value: 100,
    do: function() {
        return !1
    }
}];
var myEventsIndex = 0;
VpaidVideoPlayer.prototype.timeUpdateHandler_ = function() {
    if (this.nextQuartileIndex_ >= this.quartileEvents_.length) {
        return
    }
    var percentPlayed = this.videoSlot_.currentTime * 100.0 / this.videoSlot_.duration;
    var timeRemaining = Math.ceil(this.videoSlot_.duration - this.videoSlot_.currentTime);
    if (percentPlayed >= this.quartileEvents_[this.nextQuartileIndex_].value) {
        var lastQuartileEvent = this.quartileEvents_[this.nextQuartileIndex_].event;
        this.eventsCallbacks_[lastQuartileEvent]();
        this.nextQuartileIndex_ += 1
    }
    if (this.videoSlot_.duration > 0) {
        this.attributes_.remainingTime = this.videoSlot_.duration - this.videoSlot_.currentTime
    }
    if (percentPlayed >= myEvents[myEventsIndex].value) {
        myEvents[myEventsIndex].do();
        myEventsIndex += 1
    }
};
VpaidVideoPlayer.prototype.updateVideoSlot_ = function() {
    if (this.videoSlot_ == null) {
        this.videoSlot_ = document.createElement('video');
        this.log('Warning: No video element passed to ad, creating element.');
        this.slot_.appendChild(this.videoSlot_)
    }
    this.updateVideoPlayerSize_();
    var foundSource = !1;
    var videos = this.parameters_.videos || [];
    for (var i = 0; i < videos.length; i++) {
        if (this.videoSlot_.canPlayType(videos[i].mimetype) != '') {
            this.videoSlot_.setAttribute('src', videos[i].url);
            foundSource = !0;
            break
        }
    }
    if (!foundSource) {
        this.callEvent_('AdError')
    }
};
VpaidVideoPlayer.prototype.updateVideoPlayerSize_ = function() {
    this.videoSlot_.setAttribute('width', this.attributes_.width);
    this.videoSlot_.setAttribute('height', this.attributes_.height)
};
VpaidVideoPlayer.prototype.startAd = function() {
    this.log('Starting ad');
    this.videoSlot_.play();
    myCSS({
        ".offersContainer": {
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0",
            left: "0"
        },
        ".offer-link": {
            position: "absolute",
            display: "none"
        },
        ".offer-link:nth-child(1)": {
            width: "19%",
            height: "58%",
            top: "48%",
            left: "19.5%",
            transform: "translate(-50%, -50%)",
            display: "block"
        },
        ".offer-link:nth-child(2)": {
            width: "25%",
            height: "77%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "block"
        },
        ".offer-link:nth-child(3)": {
            width: "19%",
            height: "58%",
            top: "48%",
            right: "1%",
            transform: "translate(-50%, -50%)",
            display: "block"
        },
        ".main-link": {
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
            display: "block"
        },
        ".removedOffers": {
            display: "none"
        }
    })
};
VpaidVideoPlayer.prototype.stopAd = function() {
    this.log('Stopping ad');
    var callback = this.callEvent_.bind(this);
    setTimeout(callback, 75, ['AdStopped'])
};
VpaidVideoPlayer.prototype.resizeAd = function(width, height, viewMode) {
    this.log('resizeAd ' + width + 'x' + height + ' ' + viewMode);
    this.attributes_.width = width;
    this.attributes_.height = height;
    this.attributes_.viewMode = viewMode;
    this.updateVideoPlayerSize_();
    this.callEvent_('AdSizeChange')
};
VpaidVideoPlayer.prototype.pauseAd = function() {
    this.log('pauseAd');
    this.videoSlot_.pause();
    this.callEvent_('AdPaused')
};
VpaidVideoPlayer.prototype.resumeAd = function() {
    this.log('resumeAd');
    this.videoSlot_.play();
    this.callEvent_('AdPlaying')
};
VpaidVideoPlayer.prototype.expandAd = function() {
    this.log('expandAd');
    this.attributes_.expanded = !0;
    this.callEvent_('AdExpanded')
};
VpaidVideoPlayer.prototype.collapseAd = function() {
    this.log('collapseAd');
    this.attributes_.expanded = !1
};
VpaidVideoPlayer.prototype.skipAd = function() {
    this.log('skipAd');
    var skippableState = this.attributes_.skippableState;
    if (skippableState) {
        this.callEvent_('AdSkipped')
    }
};
VpaidVideoPlayer.prototype.subscribe = function(aCallback, eventName, aContext) {
    this.log('Subscribe ' + eventName);
    var callBack = aCallback.bind(aContext);
    this.eventsCallbacks_[eventName] = callBack
};
VpaidVideoPlayer.prototype.unsubscribe = function(eventName) {
    this.log('unsubscribe ' + eventName);
    this.eventsCallbacks_[eventName] = null
};
VpaidVideoPlayer.prototype.getAdLinear = function() {
    return this.attributes_.linear
};
VpaidVideoPlayer.prototype.getAdWidth = function() {
    return this.attributes_.width
};
VpaidVideoPlayer.prototype.getAdHeight = function() {
    return this.attributes_.height
};
VpaidVideoPlayer.prototype.getAdExpanded = function() {
    this.log('getAdExpanded');
    return this.attributes_.expanded
};
VpaidVideoPlayer.prototype.getAdSkippableState = function() {
    this.log('getAdSkippableState');
    return this.attributes_.skippableState
};
VpaidVideoPlayer.prototype.getAdRemainingTime = function() {
    return this.attributes_.remainingTime
};
VpaidVideoPlayer.prototype.getAdDuration = function() {
    return this.attributes_.duration
};
VpaidVideoPlayer.prototype.getAdVolume = function() {
    this.log('getAdVolume');
    return this.attributes_.volume
};
VpaidVideoPlayer.prototype.setAdVolume = function(value) {
    this.attributes_.volume = value;
    this.log('setAdVolume ' + value);
    this.callEvent_('AdVolumeChange')
};
VpaidVideoPlayer.prototype.getAdCompanions = function() {
    return this.attributes_.companions
};
VpaidVideoPlayer.prototype.getAdIcons = function() {
    return this.attributes_.icons
};
VpaidVideoPlayer.prototype.log = function(message) {};
VpaidVideoPlayer.prototype.callEvent_ = function(eventType) {
    if (eventType in this.eventsCallbacks_) {
        this.eventsCallbacks_[eventType]()
    }
};
var getVPAIDAd = function() {
    return new VpaidVideoPlayer()
}
