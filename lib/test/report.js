if (typeof window === 'undefined') {
	test(function(e, test, msg) {
		if (e == 'pass') {
			console.log('\033[32m\u2714\033[0m ' + test + ': ' + msg);
		} else if (e == 'fail' || e == 'except') {
			console.log('\033[31m\u2718\033[0m ' + test + ': ' + msg);
		}
	});
} else {
	var css = document.createElement('style');
	css.type = 'text/css';
	css.innerHTML = '.kludjs li, .kludjs ul { margin: 0; padding: 0; }' +
		'.kludjs-pass, .kludjs-except, .kludjs-fail { list-style: none; }' +
		'.kludjs-pass:before {content:"✓";margin-right:1em;color:green;}'+
		'.kludjs-fail:before, .kludjs-except:before {content:"✖";margin-right:1em;color:red;}' +

    //// Where a test has only one assertion, show it on a single line.
    '.kludjs-singleton ul, .kludjs-singleton li { display:inline; }' +
    '.kludjs-singleton li { margin-left:2em; }'
    ;
	document.head.appendChild(css);

	var el, testEl, assertEl, passed, failed;

	test(function(e, test, msg) {
		if (el === undefined) {
			el = document.createElement('ul');
			el.className = 'kludjs';
			(document.querySelector('.kludjs') || document.body).appendChild(el);
		}
		if (e === 'begin') {
			passed = failed = 0;
			testEl = document.createElement('li');
			assertEl = document.createElement('ul');
			testEl.appendChild(document.createTextNode(test));
			testEl.appendChild(assertEl);
			el.appendChild(testEl);
		} else if (e === 'end') {
			testEl.insertBefore(document.createTextNode(' (' + passed + '/' + (passed+failed) + ')'), assertEl);

      //// Where a test has only one assertion, show it on a single line.
      if (1 === passed && 1 === passed+failed) testEl.className = 'kludjs-singleton';

		} else if (e === 'pass' || e === 'fail' || e === 'except') {
			assertEl.innerHTML += '<li class="kludjs-item kludjs-'+e+'">' + msg + '</li>';
			if (e === 'pass') {
				passed++;
			} else {
				failed++;
			}
		}
	});
}

if (typeof module !== 'undefined') {
	module.exports = test;
}
