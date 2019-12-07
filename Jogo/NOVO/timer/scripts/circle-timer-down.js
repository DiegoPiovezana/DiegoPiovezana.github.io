"use strict";

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) define([], factory)
    else if (typeof exports === 'object') module.exports = factory()
    else root.CircleTimerDown = factory()
}(this, function () {
    Object.prototype.extend = function(object) {
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                if (typeof this[i] == "object" && this.hasOwnProperty(i) && this[i] != null) {
                    this[i].extend(object[i]);
                } else {
                    this[i] = object[i];
                }
            }
        }
        return this;
    };

    Object.defineProperty(Date.prototype, 'dateParsing', {
        value: function() {
            function pad(n) {
                return (n < 10 ? '0' : '') + n;
            }

            return this.getSeconds();
        }
    });


    function CircleTimerDown(options) {
        var date = new Date();
        var defaultOptions = {
            startDate: date.dateParsing(),
            nowDate: date.dateParsing(),
            endDate: date.setDate(date.getDate() + 5),
            labelSeconds: 'Segundos'
        }
        this.options = defaultOptions.extend(options);
        this.init();
    }

    CircleTimerDown.prototype.parseTime = function () {
        var startDate = new Date(this.options.startDate);
        /* var endDate = new Date(this.options.endDate);
        var nowDate = new Date(this.options.nowDate) */
        var endDate = new Date(this.options.endDate);
        var nowDate = new Date(this.options.nowDate)

        var newTotalSecsLeft, daysLeft, daysAll;

        newTotalSecsLeft = endDate.getTime() - nowDate.getTime(); // Millisecs
            
        /* newTotalSecsLeft = Math.ceil(newTotalSecsLeft / 1000); // Secs */
        this.totalSecsLeft = newTotalSecsLeft;
        this.offset = {
            seconds     : this.totalSecsLeft % 60
        };
        /* if (nowDate >= endDate) this.stop(); */
        if (nowDate >= endDate) this.stop();
    }

    CircleTimerDown.prototype.render = function () {
        var mainBlock = document.querySelector('.circle-timer');
        var ul = document.createElement('ul');

       /*  for (var i = 0; i < 4; i++) { */
            var li = document.createElement('li');
            var p = document.createElement('p');
            var span = document.createElement('span');
            p.appendChild(span);
            
           /*  if (i === 3) { */
                li.id = 'seconds';
                p.innerHTML += this.options.labelSeconds;
          /*   } */

            li.appendChild(p);
            li.innerHTML += '<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">' +
                                '<g>' +
                                    '<circle class="circle_main" r="50" cy="60" cx="60" fill="none"/>' +
                                    '<circle id="circle" class="circle_animation" r="50" cy="60" cx="60" fill="none"/>' +
                                '</g>' +
                            '</svg>';
            li.className = 'chart';
            ul.appendChild(li);
            ul.className = 'timer';
       /*  } */
        mainBlock.appendChild(ul);
    }

    CircleTimerDown.prototype.checkTime = function () {
        var SECONDS = 60;

        var initialOffset = 314;

        var iSeconds = SECONDS - this.offset.seconds;

     
        var secondsSpan = document.querySelector('#seconds span');

 
        var secondsCircle = document.querySelector('#seconds .circle_animation');

        this.runTimer = function () {
     
            secondsSpan.innerHTML = this.offset.seconds + '';
     
            secondsCircle.style.strokeDashoffset = initialOffset - (iSeconds * (initialOffset / SECONDS));

            this.offset.seconds--;
            iSeconds++;
        };

        this.runTimer();
    }

    CircleTimerDown.prototype.start = function () {
        this.checkTime();

        this.interval = setInterval(function () {
            this.runTimer();
        }.bind(this), 1000);
    }

    CircleTimerDown.prototype.stop = function () {
        for (var key in this.offset) {
            if (key === 'daysLeft') break;
            this.offset[key] = 0;
        }
        this.checkTime();
    }

    CircleTimerDown.prototype.init = function () {
        this.render();
        this.parseTime();
        this.start();
    }

    return CircleTimerDown;
}));