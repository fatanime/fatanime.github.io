(function ($) {
    "use strict";

    var _prefix = (function (domNode) {
        var prefixs = ["webkit", "Moz", "o", "ms"],
            props;

        for (var i in prefixs) {
            props = prefixs[i] + "Transition";
            if (domNode.style[props] !== undefined) {
                return "-" + prefixs[i].toLowerCase() + "-";
            }
        }
        return false;
    })(document.createElement("div"));

    var DEFAULT = {

        selectors: {
            sections: ".sections",
            section: ".section",
            page: ".page",
            active: ".active",
        },

        index: 0,

        timing: "ease",

        duration: 500,

        loop: false,

        pagination: true,

        keyboard: false,

        direction: "vertical",

        beforeScroll: null,

        afterScroll: null,
    };

    function FsScroll(element, options) {
        this.element = element;
        this.options = $.extend({}, DEFAULT, options || {});
        this.init();
    }

    FsScroll.prototype = {
        init: function () {
            this.selectors = this.options.selectors;
            this.sections = this.element.find(this.selectors.sections);
            this.section = this.element.find(this.selectors.section);
            this.isVertical =
                this.options.direction === "vertical" ? true : false;
            this.pagesCount = this.pagesCount();
            this.index =
                this.options.index >= 0 && this.options.index < this.pagesCount
                    ? this.options.index
                    : 0;
            this.canScroll = true;

            this._addPosition();

            if (!this.isVertical || this.index) {
                this._initLayout();
            }

            if (this.options.pagination) {
                this._initPagination();
            }

            this._initEvent();
        },


        pagesCount: function () {
            return this.section.length;
        },


        prev: function () {
            if (this.index) {
                this.index--;
            } else {
                this.index = this.pagesCount - 1;
            }
            this._scrollPage();
        },


        next: function () {
            if (this.index === this.pagesCount - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            this._scrollPage();
        },


        _getScrollLength: function () {
            return this.isVertical
                ? this.element.height()
                : this.element.width();
        },

        _addPosition: function () {
            var position = this.sections.css("position");
            if (!position || position !== "relative") {
                this.sections.css("position", "relative");
            }
        },


        _initLayout: function () {
            if (!this.isVertical) {
                var width = this.pagesCount * 100 + "%",
                    pageWidth = (100 / this.pagesCount).toFixed(2) + "%";
                this.sections.width(width);
                this.section.width(pageWidth).css("float", "left");
            }

            if (this.index) {
                this._scrollPage(true);
            }
        },


        _initPagination: function () {
            var pageCls = this.selectors.page.substring(1),
                pageHtml = "<ul class=" + pageCls + ">";

            for (var i = 0; i < this.pagesCount; i++) {
                pageHtml += "<li></li>";
            }
            pageHtml += "</ul>";
            this.element.append(pageHtml);

            var pages = this.element.find(this.selectors.page);
            this.pageItem = pages.find("li");
            this.activeCls = this.selectors.active.substring(1);
            this.pageItem.eq(this.index).addClass(this.activeCls);

            if (this.isVertical) {
                pages.addClass("vertical");
            } else {
                pages.addClass("horizontal");
            }
        },

        _initEvent: function () {
            var self = this;


            self.element.on("mousewheel DOMMouseScroll", function (e) {
                e.preventDefault();
                var delta =
                    e.originalEvent.wheelDelta || -e.originalEvent.detail;
                if (self.canScroll) {
                    if (delta > 0 && (self.options.loop || self.index)) {
                        self.prev();
                    } else if (
                        delta < 0 &&
                        (self.options.loop || self.index < self.pagesCount - 1)
                    ) {
                        self.next();
                    }
                }
            });


            if (self.options.keyboard) {
                $(document).on("keyup", function (e) {
                    var keyCode = e.keyCode;
                    if (keyCode === 37 || keyCode === 38) {
                        self.prev();
                    } else if (keyCode === 39 || keyCode === 40) {
                        self.next();
                    }
                });
            }

            var timer = null;
            $(window).on("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(function () {

                    if (!self.index) {
                        return;
                    }

                    var offset = self.section.eq(self.index).offset();
                    var scrollLength = self._getScrollLength();
                    var offsetDelta = self.isVertical
                        ? offset.top
                        : offset.left;
                    if (Math.abs(offsetDelta) > scrollLength / 2) {
                        if (offsetDelta > 0) {
                            self.index--;
                        } else {
                            self.index++;
                        }
                    }
                    self._scrollPage();
                }, 200);
            });


            self.element.on("click", this.selectors.page + " li", function (e) {
                self.index = $(this).index();
                self._scrollPage();
            });

            if (_prefix) {
                self.sections.on(
                    "transitionend webkitTransitionEnd oTransitionEnd otransitionend",
                    function () {
                        self.canScroll = true;
                        self._afterScroll();
                    },
                );
            }
        },


        _scrollPage: function (init) {
            var self = this,
                dest = self.section.eq(self.index).position();

            if (!dest) return;

            self.canScroll = false;
            this._beforeScroll();

            if (_prefix) {
                var translate = self.isVertical
                    ? "translateY(-" + dest.top + "px)"
                    : "translateX(-" + dest.left + "px)";
                self.sections.css(
                    _prefix + "transition",
                    "all " +
                        self.options.duration +
                        "ms " +
                        self.options.timing,
                );
                self.sections.css(_prefix + "transform", translate);
            } else {

                var animateCss = self.isVertical
                    ? { top: -dest.top }
                    : { left: -dest.left };
                self.sections.animate(
                    animateCss,
                    self.options.duration,
                    function () {
                        self.canScroll = true;
                        self._afterScroll();
                    },
                );
            }

            if (self.options.pagination && !init) {
                self.pageItem
                    .eq(self.index)
                    .addClass(self.activeCls)
                    .siblings("li")
                    .removeClass(self.activeCls);
            }
        },


        _beforeScroll: function () {
            var self = this;
            if (
                self.options.beforeScroll &&
                $.type(self.options.beforeScroll) === "function"
            ) {
                self.options.beforeScroll.call(
                    self,
                    self.section.eq(self.index),
                    self.index,
                );
            }
        },


        _afterScroll: function () {
            var self = this;
            if (
                self.options.afterScroll &&
                $.type(self.options.afterScroll) === "function"
            ) {
                self.options.afterScroll.call(
                    self,
                    self.section.eq(self.index),
                    self.index,
                );
            }
        },
    };

    $.fn.fsScroll = function (options) {
        return this.each(function () {
            var self = $(this),
                instance = self.data("fsScroll");

            if (!instance) {
                instance = new FsScroll(self, options);
                self.data("fsScroll", instance);
            }

            if (typeof options === "string" && instance[options]) {
                return instance[options]();
            }
        });
    };

    $(function () {
        $("[data-fs-scroll]").fsScroll();
    });
})(jQuery);
