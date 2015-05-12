(function($) {
	var lut = {
		'0': 0x3F, '1': 0x06, '2': 0x5B, '3': 0x4F, '4': 0x66, '5': 0x6D, '6': 0x7D, '7': 0x07, '8': 0x7F, '9': 0x6F, '-': 0x40,

		'a': 0x5f, 'b': 0x7C, 'c': 0x58, 'd': 0x5E, 'e': 0x79, 'f': 0x71, 'g': 0x6F, 'h': 0x74, 'i': 0x04, 'j': 0x1E, 'k': 0x78, 'l': 0x30, 'm': 0x15,
		'n': 0x54, 'o': 0x5C, 'p': 0x73, 'q': 0x67, 'r': 0x50, 's': 0x6D, 't': 0x78, 'u': 0x3E, 'v': 0x1C, 'w': 0x2A, 'x': 0x76, 'y': 0x6E, 'z': 0x5B,

		'A': 0x77, 'B': 0x7C, 'C': 0x39, 'D': 0x5E, 'E': 0x79, 'F': 0x71, 'G': 0x6F, 'H': 0x76, 'I': 0x06, 'J': 0x1E, 'K': 0x76, 'L': 0x38, 'M': 0x15,
		'N': 0x54, 'O': 0x3F, 'P': 0x73, 'Q': 0x67, 'R': 0x50, 'S': 0x6D, 'T': 0x78, 'U': 0x3E, 'V': 0x1C, 'W': 0x2A, 'X': 0x76, 'Y': 0x6E, 'Z': 0x5B
		},
	uid = (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;}})(),
	methods = {
		init : function(options) {
			var settings = $.extend({
				'blocks': 4,
				'cssClass': 'se7enseg',
				'soft': false,
				'slant': false,
				'size': '9pt',
				'off': undefined,
				'on': undefined
			}, options);

			return this.each(function() {
				$(this).data('se7enseg', {});

				var o = settings,
					data = $(this).data('se7enseg'),
					se7enseg = $('<div></div>').addClass(o.cssClass);
					data.target = se7enseg.get(0),
					text = $(this).data('text'),
					id = undefined;

				if(o.off || o.on) {
					se7enseg.attr('id', '_s7_'+uid());

					if(o.off) {
						var css = '#' + se7enseg.attr('id') + ' .upper, #' + se7enseg.attr('id') + ' .lower, #' + se7enseg.attr('id') + ' .dot span {border-color:'+o.off+';}';
						$('<style></style>').attr('type', 'text/css').html(css).appendTo($('head'));
					}

					if(o.on) {
						se7enseg.css('color', o.on);
					}
				}

				if(o.soft) {
					se7enseg.addClass('soft');
				}

				if(o.slant) {
					se7enseg.addClass('slant');
				}

				if(o.size) {
					se7enseg.css('font-size', o.size);
				}

				for(var i = 0; i < o.blocks; i++) {
					$('<div class="segment"><div class="digit"><div class="upper"></div><div class="lower"></div></div><div class="dot"><span></span></div></div>').appendTo($(se7enseg));
				}

				$(se7enseg).appendTo($(this));

				if(text) {
					$(this).se7enseg('write', text);
				}
			});
		},
		segment : function(cssClass) {
			var wrapper = $(this).data('se7enseg').target;
			wrapper.find('.dot').removeClass('on');
			wrapper.find('.segment').removeClass('sA sB sC sD sE sF sG').addClass(cssClass);
		},
		write : function(s) {
			return this.each(function() {
				var data = $(this).data('se7enseg'),
				    wrapper = $(data.target),
				    numDots = wrapper.find('.dot').length,
				    lcdLen = wrapper.find('.segment').length,
				    maxLen = lcdLen,
				    dotPos = [],
				    newStr = '',
				    str = new String(s);

				wrapper.find('.segment').removeClass('sA sB sC sD sE sF sG');
				wrapper.find('.dot').removeClass('on');

				for(var i = 0; i < str.length; i++) {
					if(i < str.length && (str[i] == '.' || str[i] == ',')) {
						dotPos.push(newStr.length - 1);
					}
					else {
						newStr += str[i];
					}
				}

				if(newStr.length < maxLen) {
					maxLen = newStr.length;
				}

				for(var i = 0; i < maxLen; i++) {
					var num = lut[newStr[i]];

					if(num) {
						var dot = $(wrapper.find('.dot').get((lcdLen - maxLen) + i)),
							seg = $(wrapper.find('.segment').get((lcdLen - maxLen) + i));

						if(num & 1) {
							seg.addClass('sA');
						}
						if(num & 2) {
							seg.addClass('sB');
						}
						if(num & 4) {
							seg.addClass('sC');
						}
						if(num & 8) {
							seg.addClass('sD');
						}
						if(num & 16) {
							seg.addClass('sE');
						}
						if(num & 32) {
							seg.addClass('sF');
						}
						if(num & 64) {
							seg.addClass('sG');
						}

						if($.inArray(i, dotPos) >= 0) {
							dot.addClass('on');
						}
					}
				}
			});
		}
	};

/*

	function setSegment (elem, value) {
		$(elem).removeClass('sA sB sC sD sE sF sG');
		if(value == '-') {
			value = 'minus';
		}
	};
*/

	$.fn.se7enseg = function(method) {
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.se7enseg');
		}
	};

})(jQuery);
