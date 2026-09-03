var Page = (function () {

	var $container = $('#container'),
		$bookBlock = $('#bb-bookblock'),
		$items = $bookBlock.children(),
		itemsCount = $items.length,
		current = 0,
		bb = $('#bb-bookblock').bookblock({
			speed: 800,
			perspective: 2000,
			shadowSides: 0.8,
			shadowFlip: 0.4,
			onEndFlip: function (old, page, isLimit) {

				current = page;
				// update TOC current
				updateTOC();
				// updateNavigation
				updateNavigation(isLimit);
				// initialize jScrollPane on the content div for the new item
				setJSP('init');
				// destroy jScrollPane on the content div for the old item
				setJSP('destroy', old);

			}
		}),
		$navNext = $('#bb-nav-next'),
		$navPrev = $('#bb-nav-prev').hide(),
		$menuItems = $container.find('ul.menu-toc > li > a'),
		$tblcontents = $('#tblcontents'),
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		supportTransitions = Modernizr.csstransitions;

	function init() {

		// initialize jScrollPane on the content div of the first item
		setJSP('init');
		initEvents();

	}

	function initEvents() {

		// add navigation events
		$navNext.on('click', function () {
			bb.next();
			return false;
		});

		$navPrev.on('click', function () {
			bb.prev();
			return false;
		});

		// add swipe events
		$items.on({
			'swipeleft': function (event) {
				if ($container.data('opened')) {
					return false;
				}
				bb.next();
				return false;
			},
			'swiperight': function (event) {
				if ($container.data('opened')) {
					return false;
				}
				bb.prev();
				return false;
			}
		});

		// show table of contents
		$tblcontents.on('click', toggleTOC);

		// click a menu item
		$menuItems.on('click', function () {
			// console.log('clicked item '+ $(this).attr('ctrl'))
			var $el = $(this),
				idx = $el.attr('ctrl'),
				pgid = $el.attr('id'),
				jump = function () {
					bb.jump(idx, pgid);
				};
			console.log('jump ' + bb.jump(idx))
			// updateTOC();
			console.log('jump id ' + idx)

			current !== idx ? closeTOC( jump ) : closeTOC();
			
			// if($('#container').hasClass('slideRight')){
			// 	current !== idx ? closeTOC(jump) : closeTOC();
			// }else{
			// 	current !== idx ? bb.jump(idx) : bb.jump(idx);
			// }
			
			return false;
		});

		// reinit jScrollPane on window resize
		$(window).on('debouncedresize', function () {
			// reinitialise jScrollPane on the content div
			setJSP('reinit');
		});

	}

	function loadDiv() {
		if (window.location.href.lastIndexOf('#') >= 1) {
			var url = window.location.href;
			var id = url.substring(url.lastIndexOf('#'));

			var splitId = id.split('#')
			var getPgNo = $('#'+splitId[1]).attr('pgNo')
			console.log('split id '+ splitId[1])
			console.log('getPgNo url ' , getPgNo)
			if (current !== getPgNo && getPgNo != undefined) {
				bb.jump(getPgNo)
			}else if (getPgNo == undefined){
				// console.log('split id '+ splitId[1])
				alert('The page you are looking for is not found!')
				// bb.jump(53)
			}
		}
	}

	setTimeout(function () {
		loadDiv();
	}, 2000);

	$(window).on('hashchange', function(e){
		loadDiv();
	});

	function setJSP(action, idx) {

		var idx = idx === undefined ? current : idx,
			$content = $items.eq(idx).children('div.content'),
			apiJSP = $content.data('jsp');

		if (action === 'init' && apiJSP === undefined) {
			$content.jScrollPane({ verticalGutter: 0, hideFocus: true });
		}
		else if (action === 'reinit' && apiJSP !== undefined) {
			apiJSP.reinitialise();
		}
		else if (action === 'destroy' && apiJSP !== undefined) {
			apiJSP.destroy();
		}

	}

	function updateTOC() {
		$menuItems.removeClass('menu-toc-current').eq(current).addClass('menu-toc-current');
	}

	function updateNavigation(isLastPage) {

		if (current === 0) {
			$navNext.show();
			$navPrev.hide();
		}
		else if (isLastPage) {
			$navNext.hide();
			$navPrev.show();
		}
		else {
			$navNext.show();
			$navPrev.show();
		}

	}

	function toggleTOC() {
		var opened = $container.data('opened');
		opened ? closeTOC() : openTOC();
	}

	function openTOC() {
		$navNext.hide();
		$navPrev.hide();
		$container.addClass('slideRight').data('opened', true);
	}

	function closeTOC(callback) {

		updateNavigation(current === itemsCount - 1);
		$container.removeClass('slideRight').data('opened', false);
		if (callback) {
			if (supportTransitions) {
				$container.on(transEndEventName, function () {
					$(this).off(transEndEventName);
					callback.call();
				});
			}
			else {
				callback.call();
			}
		}

	}

	return { init: init };

})();