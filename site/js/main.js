
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * * Sort Object by Key
     *
     * @param {object} ObjectsToSort Object than contain data to sort
     * @param {string} KeyToSearch Key to sort data
     *
     * TODO: More Robust Validation
     */
    function sortObjetcByKey(ObjectsToSort, KeyToSearch) {
      if (Array.isArray(ObjectsToSort) && KeyToSearch) {
        const OrderObj = ObjectsToSort.sort((a, b) =>
          a[KeyToSearch].toLowerCase().trim() > b[KeyToSearch].toLowerCase().trim()
            ? 1
            : -1
        );
        return OrderObj;
      } else return false;
    }

    /* src/Components/Header.svelte generated by Svelte v3.24.0 */

    const { console: console_1 } = globals;
    const file = "src/Components/Header.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div0;
    	let a;
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t0;
    	let div2;
    	let div1;
    	let span;
    	let t2;
    	let i;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			a = element("a");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "Instalar";
    			t2 = space();
    			i = element("i");
    			i.textContent = "favorite";
    			attr_dev(path0, "d", "m 8.769578,8.81618 h 7.520376 c 0,3.587775 -2.534384,6.67593\n          -6.053223,7.375875 C 6.717891,16.891993 3.19464,15.008782\n          1.821657,11.694104 0.448673,8.379426 1.608352,4.556474\n          4.591481,2.563212 7.57461,0.56995 11.550344,0.961528\n          14.087286,3.498468");
    			set_style(path0, "fill", "none");
    			set_style(path0, "fill-opacity", "0");
    			set_style(path0, "stroke-width", "2.50136");
    			set_style(path0, "stroke-linejoin", "miter");
    			set_style(path0, "stroke-miterlimit", "4");
    			set_style(path0, "stroke-dasharray", "none");
    			set_style(path0, "stroke-opacity", "1");
    			attr_dev(path0, "id", "path4296");
    			attr_dev(path0, "class", "svelte-gm3pwn");
    			add_location(path0, file, 78, 8, 1750);
    			attr_dev(path1, "d", "m 31.878773,5.0110277 -0.01918,12.5055583 m -1e-6,-6.890698 A\n          5.6400223,5.6400223 0 0 1 26.21957,16.26591 5.6400223,5.6400223 0 0 1\n          20.579548,10.625888 5.6400223,5.6400223 0 0 1 26.21957,4.9858656\n          5.6400223,5.6400223 0 0 1 31.859592,10.625888");
    			set_style(path1, "fill", "none");
    			set_style(path1, "fill-opacity", "0");
    			set_style(path1, "fill-rule", "evenodd");
    			set_style(path1, "stroke-width", "2.50135");
    			set_style(path1, "stroke-linecap", "butt");
    			set_style(path1, "stroke-linejoin", "miter");
    			set_style(path1, "stroke-miterlimit", "4");
    			set_style(path1, "stroke-dasharray", "none");
    			set_style(path1, "stroke-opacity", "1");
    			attr_dev(path1, "id", "path4302");
    			attr_dev(path1, "class", "svelte-gm3pwn");
    			add_location(path1, file, 86, 8, 2236);
    			attr_dev(path2, "d", "m 75.868555,15.530364 c -2.21071,1.276349 -5.00308,0.908733\n          -6.80811,-0.896302 -1.80504,-1.805035 -2.17266,-4.597405\n          -0.89631,-6.80811 1.27636,-2.210713 3.87842,-3.288522\n          6.34415,-2.627831 2.46572,0.660683 4.18027,2.895134 4.18027,5.447841 h\n          -5.64002");
    			set_style(path2, "fill", "none");
    			set_style(path2, "fill-opacity", "0");
    			set_style(path2, "stroke-width", "2.50136");
    			set_style(path2, "stroke-miterlimit", "4");
    			set_style(path2, "stroke-dasharray", "none");
    			set_style(path2, "stroke-opacity", "1");
    			attr_dev(path2, "id", "path4304");
    			attr_dev(path2, "class", "svelte-gm3pwn");
    			add_location(path2, file, 93, 8, 2747);
    			attr_dev(path3, "d", "m 89.754017,16.232097 c -3.114903,0 -5.640028,-2.525125\n          -5.640028,-5.640028 m 0,-10.591984259876 V 7.0497671 10.836345 M\n          89.742185,5.0047267 81.729449,4.992069");
    			set_style(path3, "fill", "none");
    			set_style(path3, "fill-opacity", "0");
    			set_style(path3, "stroke-width", "2.50135");
    			set_style(path3, "stroke-miterlimit", "4");
    			set_style(path3, "stroke-dasharray", "none");
    			set_style(path3, "stroke-opacity", "1");
    			attr_dev(path3, "id", "path4312");
    			attr_dev(path3, "class", "svelte-gm3pwn");
    			add_location(path3, file, 101, 8, 3216);
    			attr_dev(path4, "d", "M 47.467589,0.00136965 47.44841,17.516586 m 0,-6.890699 a\n          5.6400224,5.6400224 0 0 1 -5.640023,5.640023 5.6400224,5.6400224 0 0 1\n          -5.640022,-5.640023 5.6400224,5.6400224 0 0 1 5.640022,-5.6400221\n          5.6400224,5.6400224 0 0 1 5.640023,5.6400221");
    			set_style(path4, "fill", "none");
    			set_style(path4, "fill-opacity", "0");
    			set_style(path4, "fill-rule", "evenodd");
    			set_style(path4, "stroke-width", "2.50135");
    			set_style(path4, "stroke-linecap", "butt");
    			set_style(path4, "stroke-linejoin", "miter");
    			set_style(path4, "stroke-miterlimit", "4");
    			set_style(path4, "stroke-dasharray", "none");
    			set_style(path4, "stroke-opacity", "1");
    			attr_dev(path4, "id", "path4328");
    			attr_dev(path4, "class", "svelte-gm3pwn");
    			add_location(path4, file, 107, 8, 3574);
    			attr_dev(path5, "id", "path4322");
    			set_style(path5, "fill", "none");
    			set_style(path5, "fill-opacity", "0");
    			set_style(path5, "stroke-width", "2.50135");
    			set_style(path5, "stroke-miterlimit", "4");
    			set_style(path5, "stroke-dasharray", "none");
    			set_style(path5, "stroke-opacity", "1");
    			attr_dev(path5, "d", "m 63.122585,17.072501 c 0,3.114898 -2.526416,5.659172\n          -5.641314,5.659172 M 63.014288,5.0137675 63.121293,17.103785 m\n          -0.08406,-6.457832 a 5.6400224,5.6400224 0 0 1 -5.640022,5.640023\n          5.6400224,5.6400224 0 0 1 -5.640023,-5.640023 5.6400224,5.6400224 0 0\n          1 5.640023,-5.6400214 5.6400224,5.6400224 0 0 1 5.640022,5.6400214");
    			attr_dev(path5, "class", "svelte-gm3pwn");
    			add_location(path5, file, 114, 8, 4082);
    			attr_dev(svg, "id", "logo");
    			attr_dev(svg, "aria-label", "Logo Gadget");
    			attr_dev(svg, "class", "logo svelte-gm3pwn");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "viewBox", "0 0 90 24");
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "width", "100");
    			add_location(svg, file, 69, 6, 1573);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "title", "Gadget");
    			attr_dev(a, "class", "svelte-gm3pwn");
    			add_location(a, file, 67, 4, 1538);
    			attr_dev(div0, "class", "logoContainer svelte-gm3pwn");
    			add_location(div0, file, 66, 2, 1506);
    			attr_dev(span, "class", "svelte-gm3pwn");
    			add_location(span, file, 129, 6, 4748);
    			attr_dev(i, "class", "material-icons btn-icon hover svelte-gm3pwn");
    			add_location(i, file, 130, 6, 4776);
    			attr_dev(div1, "id", "add-button");
    			attr_dev(div1, "class", "svelte-gm3pwn");
    			add_location(div1, file, 128, 4, 4720);
    			attr_dev(div2, "class", "iconContainer svelte-gm3pwn");
    			attr_dev(div2, "title", "Instalar");
    			add_location(div2, file, 126, 2, 4646);
    			attr_dev(div3, "class", "searchBarContainer svelte-gm3pwn");
    			add_location(div3, file, 65, 0, 1471);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, a);
    			append_dev(a, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(div1, t2);
    			append_dev(div1, i);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	onMount(async () => {
    		// Install App Function
    		let deferredPrompt;

    		const addBtn = document.querySelector("#add-button");
    		addBtn.style.display = "none";

    		window.addEventListener("beforeinstallprompt", e => {
    			e.preventDefault();
    			deferredPrompt = e;
    			addBtn.style.display = "block";

    			addBtn.addEventListener("click", e => {
    				addBtn.style.display = "none";
    				deferredPrompt.prompt();

    				deferredPrompt.userChoice.then(choiceResult => {
    					if (choiceResult.outcome === "accepted") {
    						console.log("User accepted the A2HS prompt");
    					} else {
    						console.log("User dismissed the A2HS prompt");
    					}

    					deferredPrompt = null;
    				});
    			});
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header", $$slots, []);
    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Components/Card.svelte generated by Svelte v3.24.0 */

    const file$1 = "src/Components/Card.svelte";

    // (120:4) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "site/images/no-image.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[2].name);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "image svelte-128t2yp");
    			add_location(img, file$1, 120, 6, 2298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && img_alt_value !== (img_alt_value = /*item*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(120:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (114:4) {#if item.image}
    function create_if_block_3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = imgPath + /*item*/ ctx[2].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[2].name);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "image svelte-128t2yp");
    			add_location(img, file$1, 114, 6, 2168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && img.src !== (img_src_value = imgPath + /*item*/ ctx[2].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 4 && img_alt_value !== (img_alt_value = /*item*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(114:4) {#if item.image}",
    		ctx
    	});

    	return block;
    }

    // (130:4) {#if ONLINE}
    function create_if_block_1(ctx) {
    	let h1;
    	let t0_value = /*item*/ ctx[2].price + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*item*/ ctx[2].feeValue && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "card-price svelte-128t2yp");
    			add_location(h1, file$1, 130, 6, 2526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			if (if_block) if_block.m(h1, null);

    			if (!mounted) {
    				dispose = listen_dev(h1, "click", stop_propagation(/*click_handler*/ ctx[5]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && t0_value !== (t0_value = /*item*/ ctx[2].price + "")) set_data_dev(t0, t0_value);

    			if (/*item*/ ctx[2].feeValue) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(h1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(130:4) {#if ONLINE}",
    		ctx
    	});

    	return block;
    }

    // (135:8) {#if item.feeValue}
    function create_if_block_2(ctx) {
    	let span;
    	let t0_value = /*item*/ ctx[2].feeAmount + "";
    	let t0;
    	let t1;
    	let t2_value = /*item*/ ctx[2].feeValue + "";
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" cuotas de ");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "fee svelte-128t2yp");
    			add_location(span, file$1, 135, 10, 2711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 4 && t0_value !== (t0_value = /*item*/ ctx[2].feeAmount + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*item*/ 4 && t2_value !== (t2_value = /*item*/ ctx[2].feeValue + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(135:8) {#if item.feeValue}",
    		ctx
    	});

    	return block;
    }

    // (140:4) {#if item.stock > 0}
    function create_if_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "entrega inmediata";
    			attr_dev(span, "class", "card-flag in-stock svelte-128t2yp");
    			add_location(span, file$1, 140, 6, 2846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(140:4) {#if item.stock > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let h1;
    	let t1_value = /*item*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let button0;
    	let t5_value = /*item*/ ctx[2].brand + "";
    	let t5;
    	let t6;
    	let button1;
    	let t7_value = /*item*/ ctx[2].productType + "";
    	let t7;
    	let t8;
    	let div1;
    	let raw_value = /*item*/ ctx[2].description + "";
    	let div3_data_name_value;
    	let div3_id_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[2].image) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*ONLINE*/ ctx[1] && create_if_block_1(ctx);
    	let if_block2 = /*item*/ ctx[2].stock > 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			button0 = element("button");
    			t5 = text(t5_value);
    			t6 = space();
    			button1 = element("button");
    			t7 = text(t7_value);
    			t8 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "card-image svelte-128t2yp");
    			add_location(div0, file$1, 112, 2, 2116);
    			attr_dev(h1, "class", "card-title svelte-128t2yp");
    			add_location(h1, file$1, 128, 4, 2463);
    			attr_dev(button0, "class", "outline svelte-128t2yp");
    			add_location(button0, file$1, 142, 4, 2918);
    			attr_dev(button1, "class", "outline svelte-128t2yp");
    			add_location(button1, file$1, 147, 4, 3046);
    			attr_dev(div1, "class", "card-description svelte-128t2yp");
    			add_location(div1, file$1, 152, 4, 3186);
    			attr_dev(div2, "class", "card-body svelte-128t2yp");
    			add_location(div2, file$1, 127, 2, 2435);
    			attr_dev(div3, "class", "card svelte-128t2yp");
    			attr_dev(div3, "data-name", div3_data_name_value = /*item*/ ctx[2].name);
    			attr_dev(div3, "title", "Click para ampliar o cerrar");
    			attr_dev(div3, "id", div3_id_value = /*item*/ ctx[2].id);
    			toggle_class(div3, "outStock", /*item*/ ctx[2].stock < 1);
    			toggle_class(div3, "active", /*active*/ ctx[3]);
    			add_location(div3, file$1, 104, 0, 1942);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			if_block0.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			append_dev(div2, button0);
    			append_dev(button0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(button1, t7);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			div1.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", stop_propagation(/*click_handler_1*/ ctx[6]), false, false, true),
    					listen_dev(button1, "click", stop_propagation(/*click_handler_2*/ ctx[7]), false, false, true),
    					listen_dev(div3, "click", /*clickOnCard*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*item*/ 4 && t1_value !== (t1_value = /*item*/ ctx[2].name + "")) set_data_dev(t1, t1_value);

    			if (/*ONLINE*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*item*/ ctx[2].stock > 0) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*item*/ 4 && t5_value !== (t5_value = /*item*/ ctx[2].brand + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*item*/ 4 && t7_value !== (t7_value = /*item*/ ctx[2].productType + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*item*/ 4 && raw_value !== (raw_value = /*item*/ ctx[2].description + "")) div1.innerHTML = raw_value;
    			if (dirty & /*item*/ 4 && div3_data_name_value !== (div3_data_name_value = /*item*/ ctx[2].name)) {
    				attr_dev(div3, "data-name", div3_data_name_value);
    			}

    			if (dirty & /*item*/ 4 && div3_id_value !== (div3_id_value = /*item*/ ctx[2].id)) {
    				attr_dev(div3, "id", div3_id_value);
    			}

    			if (dirty & /*item*/ 4) {
    				toggle_class(div3, "outStock", /*item*/ ctx[2].stock < 1);
    			}

    			if (dirty & /*active*/ 8) {
    				toggle_class(div3, "active", /*active*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const imgPath = "/products_images/";

    function instance$1($$self, $$props, $$invalidate) {
    	let active = false;
    	const isShare = navigator.share;
    	let { QUERY } = $$props, { ONLINE } = $$props, { item } = $$props;

    	// Open / Close Card
    	function clickOnCard() {
    		const className = "active";

    		if (this.classList.contains(className)) {
    			this.classList.remove(className);
    			location.hash = QUERY.replace(/( )/g, "_");
    		} else {
    			location.hash = this.dataset.name.replace(/( )/g, "_");
    			this.classList.add(className);
    		}
    	}

    	const writable_props = ["QUERY", "ONLINE", "item"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Card", $$slots, []);
    	const click_handler = () => window.copyToClipboard(`${item.name} ${item.price}`);
    	const click_handler_1 = () => $$invalidate(0, QUERY = item.brand);
    	const click_handler_2 = () => $$invalidate(0, QUERY = item.productType);

    	$$self.$set = $$props => {
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("ONLINE" in $$props) $$invalidate(1, ONLINE = $$props.ONLINE);
    		if ("item" in $$props) $$invalidate(2, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		imgPath,
    		active,
    		isShare,
    		QUERY,
    		ONLINE,
    		item,
    		clickOnCard
    	});

    	$$self.$inject_state = $$props => {
    		if ("active" in $$props) $$invalidate(3, active = $$props.active);
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("ONLINE" in $$props) $$invalidate(1, ONLINE = $$props.ONLINE);
    		if ("item" in $$props) $$invalidate(2, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		QUERY,
    		ONLINE,
    		item,
    		active,
    		clickOnCard,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { QUERY: 0, ONLINE: 1, item: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*QUERY*/ ctx[0] === undefined && !("QUERY" in props)) {
    			console.warn("<Card> was created without expected prop 'QUERY'");
    		}

    		if (/*ONLINE*/ ctx[1] === undefined && !("ONLINE" in props)) {
    			console.warn("<Card> was created without expected prop 'ONLINE'");
    		}

    		if (/*item*/ ctx[2] === undefined && !("item" in props)) {
    			console.warn("<Card> was created without expected prop 'item'");
    		}
    	}

    	get QUERY() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set QUERY(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ONLINE() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ONLINE(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/ProductList.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/Components/ProductList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (110:2) {:else}
    function create_else_block_1(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "svelte-ukzoxa");
    			add_location(div0, file$2, 113, 8, 2326);
    			attr_dev(div1, "class", "svelte-ukzoxa");
    			add_location(div1, file$2, 114, 8, 2342);
    			attr_dev(div2, "class", "svelte-ukzoxa");
    			add_location(div2, file$2, 115, 8, 2358);
    			attr_dev(div3, "class", "svelte-ukzoxa");
    			add_location(div3, file$2, 116, 8, 2374);
    			attr_dev(div4, "class", "lds-ellipsis svelte-ukzoxa");
    			add_location(div4, file$2, 112, 6, 2291);
    			attr_dev(div5, "class", "loading svelte-ukzoxa");
    			add_location(div5, file$2, 111, 4, 2263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(110:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (98:2) {#if PRODUCTS_SHOWED}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*PRODUCTS_SHOWED*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*PRODUCTS_SHOWED, ONLINE, QUERY, showProductOnStock*/ 15) {
    				each_value = /*PRODUCTS_SHOWED*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(98:2) {#if PRODUCTS_SHOWED}",
    		ctx
    	});

    	return block;
    }

    // (106:6) {:else}
    function create_else_block$1(ctx) {
    	let card;
    	let updating_QUERY;
    	let current;

    	function card_QUERY_binding_1(value) {
    		/*card_QUERY_binding_1*/ ctx[5].call(null, value);
    	}

    	let card_props = {
    		item: /*item*/ ctx[7],
    		ONLINE: /*ONLINE*/ ctx[2]
    	};

    	if (/*QUERY*/ ctx[0] !== void 0) {
    		card_props.QUERY = /*QUERY*/ ctx[0];
    	}

    	card = new Card({ props: card_props, $$inline: true });
    	binding_callbacks.push(() => bind(card, "QUERY", card_QUERY_binding_1));

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*PRODUCTS_SHOWED*/ 2) card_changes.item = /*item*/ ctx[7];
    			if (dirty & /*ONLINE*/ 4) card_changes.ONLINE = /*ONLINE*/ ctx[2];

    			if (!updating_QUERY && dirty & /*QUERY*/ 1) {
    				updating_QUERY = true;
    				card_changes.QUERY = /*QUERY*/ ctx[0];
    				add_flush_callback(() => updating_QUERY = false);
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(106:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:6) {#if showProductOnStock}
    function create_if_block_1$1(ctx) {
    	let t;
    	let current;
    	let if_block = /*item*/ ctx[7].stock > 0 && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[7].stock > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*PRODUCTS_SHOWED*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(100:6) {#if showProductOnStock}",
    		ctx
    	});

    	return block;
    }

    // (102:8) {#if item.stock > 0}
    function create_if_block_2$1(ctx) {
    	let card;
    	let updating_QUERY;
    	let current;

    	function card_QUERY_binding(value) {
    		/*card_QUERY_binding*/ ctx[4].call(null, value);
    	}

    	let card_props = {
    		item: /*item*/ ctx[7],
    		ONLINE: /*ONLINE*/ ctx[2]
    	};

    	if (/*QUERY*/ ctx[0] !== void 0) {
    		card_props.QUERY = /*QUERY*/ ctx[0];
    	}

    	card = new Card({ props: card_props, $$inline: true });
    	binding_callbacks.push(() => bind(card, "QUERY", card_QUERY_binding));

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*PRODUCTS_SHOWED*/ 2) card_changes.item = /*item*/ ctx[7];
    			if (dirty & /*ONLINE*/ 4) card_changes.ONLINE = /*ONLINE*/ ctx[2];

    			if (!updating_QUERY && dirty & /*QUERY*/ 1) {
    				updating_QUERY = true;
    				card_changes.QUERY = /*QUERY*/ ctx[0];
    				add_flush_callback(() => updating_QUERY = false);
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(102:8) {#if item.stock > 0}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#each PRODUCTS_SHOWED as item}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*showProductOnStock*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(99:4) {#each PRODUCTS_SHOWED as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*PRODUCTS_SHOWED*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block.c();
    			attr_dev(section, "class", "products-list svelte-ukzoxa");
    			add_location(section, file$2, 96, 0, 1863);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_blocks[current_block_type_index].m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(section, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { PRODUCTS_SHOWED } = $$props, { QUERY } = $$props, { ONLINE } = $$props;
    	let listType = "";
    	let { showProductOnStock } = $$props;
    	const writable_props = ["PRODUCTS_SHOWED", "QUERY", "ONLINE", "showProductOnStock"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProductList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ProductList", $$slots, []);

    	function card_QUERY_binding(value) {
    		QUERY = value;
    		$$invalidate(0, QUERY);
    	}

    	function card_QUERY_binding_1(value) {
    		QUERY = value;
    		$$invalidate(0, QUERY);
    	}

    	$$self.$set = $$props => {
    		if ("PRODUCTS_SHOWED" in $$props) $$invalidate(1, PRODUCTS_SHOWED = $$props.PRODUCTS_SHOWED);
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("ONLINE" in $$props) $$invalidate(2, ONLINE = $$props.ONLINE);
    		if ("showProductOnStock" in $$props) $$invalidate(3, showProductOnStock = $$props.showProductOnStock);
    	};

    	$$self.$capture_state = () => ({
    		PRODUCTS_SHOWED,
    		QUERY,
    		ONLINE,
    		Card,
    		listType,
    		showProductOnStock
    	});

    	$$self.$inject_state = $$props => {
    		if ("PRODUCTS_SHOWED" in $$props) $$invalidate(1, PRODUCTS_SHOWED = $$props.PRODUCTS_SHOWED);
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("ONLINE" in $$props) $$invalidate(2, ONLINE = $$props.ONLINE);
    		if ("listType" in $$props) listType = $$props.listType;
    		if ("showProductOnStock" in $$props) $$invalidate(3, showProductOnStock = $$props.showProductOnStock);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		QUERY,
    		PRODUCTS_SHOWED,
    		ONLINE,
    		showProductOnStock,
    		card_QUERY_binding,
    		card_QUERY_binding_1
    	];
    }

    class ProductList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			PRODUCTS_SHOWED: 1,
    			QUERY: 0,
    			ONLINE: 2,
    			showProductOnStock: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductList",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*PRODUCTS_SHOWED*/ ctx[1] === undefined && !("PRODUCTS_SHOWED" in props)) {
    			console.warn("<ProductList> was created without expected prop 'PRODUCTS_SHOWED'");
    		}

    		if (/*QUERY*/ ctx[0] === undefined && !("QUERY" in props)) {
    			console.warn("<ProductList> was created without expected prop 'QUERY'");
    		}

    		if (/*ONLINE*/ ctx[2] === undefined && !("ONLINE" in props)) {
    			console.warn("<ProductList> was created without expected prop 'ONLINE'");
    		}

    		if (/*showProductOnStock*/ ctx[3] === undefined && !("showProductOnStock" in props)) {
    			console.warn("<ProductList> was created without expected prop 'showProductOnStock'");
    		}
    	}

    	get PRODUCTS_SHOWED() {
    		throw new Error("<ProductList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set PRODUCTS_SHOWED(value) {
    		throw new Error("<ProductList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get QUERY() {
    		throw new Error("<ProductList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set QUERY(value) {
    		throw new Error("<ProductList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ONLINE() {
    		throw new Error("<ProductList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ONLINE(value) {
    		throw new Error("<ProductList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProductOnStock() {
    		throw new Error("<ProductList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProductOnStock(value) {
    		throw new Error("<ProductList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Footer.svelte generated by Svelte v3.24.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/Components/Footer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (95:2) {#if active}
    function create_if_block_4(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*action*/ ctx[5] == "search") return create_if_block_5;
    		if (/*action*/ ctx[5] == "share") return create_if_block_7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "floatContainer svelte-3zzsfh");
    			attr_dev(div, "id", "floatContainer");
    			add_location(div, file$3, 96, 4, 1924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(95:2) {#if active}",
    		ctx
    	});

    	return block;
    }

    // (130:34) 
    function create_if_block_7(ctx) {
    	let div;
    	let a0;
    	let svg0;
    	let title0;
    	let t0;
    	let path0;
    	let a0_href_value;
    	let t1;
    	let a1;
    	let svg1;
    	let title1;
    	let t2;
    	let path1;
    	let a1_href_value;
    	let t3;
    	let a2;
    	let svg2;
    	let title2;
    	let t4;
    	let path2;
    	let a2_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			title0 = svg_element("title");
    			t0 = text("Compartir en Facebook");
    			path0 = svg_element("path");
    			t1 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			title1 = svg_element("title");
    			t2 = text("Compartir en Whatsapp");
    			path1 = svg_element("path");
    			t3 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			title2 = svg_element("title");
    			t4 = text("Compartir en Twitter");
    			path2 = svg_element("path");
    			add_location(title0, file$3, 141, 14, 3259);
    			attr_dev(path0, "fill", "currentColor");
    			attr_dev(path0, "d", "M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69\n                226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48\n                93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8\n                0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31\n                482.38 504 379.78 504 256z");
    			add_location(path0, file$3, 142, 14, 3310);
    			attr_dev(svg0, "class", "btn-icon filled");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "512");
    			attr_dev(svg0, "height", "512");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			add_location(svg0, file$3, 135, 12, 3063);
    			attr_dev(a0, "href", a0_href_value = "http://www.facebook.com/sharer.php?u=" + location.href);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-3zzsfh");
    			add_location(a0, file$3, 132, 10, 2947);
    			add_location(title1, file$3, 163, 14, 4138);
    			attr_dev(path1, "d", "M414.73,97.1A222.14,222.14,0,0,0,256.94,32C134,32,33.92,131.58,33.87,254A220.61,220.61,0,0,0,63.65,365L32,480l118.25-30.87a223.63,223.63,0,0,0,106.6,27h.09c122.93,0,223-99.59,223.06-222A220.18,220.18,0,0,0,414.73,97.1ZM256.94,438.66h-.08a185.75,185.75,0,0,1-94.36-25.72l-6.77-4L85.56,427.26l18.73-68.09-4.41-7A183.46,183.46,0,0,1,71.53,254c0-101.73,83.21-184.5,185.48-184.5A185,185,0,0,1,442.34,254.14C442.3,355.88,359.13,438.66,256.94,438.66ZM358.63,300.47c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54,2.78-14.4,18-17.65,21.75-6.5,4.16-12.07,1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56,2.44-11.32c2.51-2.49,5.57-6.48,8.36-9.72s3.72-5.56,5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53,20.53,0,0,0-14.86,6.94c-5.11,5.56-19.51,19-19.51,46.28s20,53.68,22.76,57.38,39.3,59.73,95.21,83.76a323.11,323.11,0,0,0,31.78,11.68c13.35,4.22,25.5,3.63,35.1,2.2,10.71-1.59,33-13.42,37.63-26.38s4.64-24.06,3.25-26.37S364.21,303.24,358.63,300.47Z");
    			set_style(path1, "fill-rule", "evenodd");
    			add_location(path1, file$3, 164, 14, 4189);
    			attr_dev(svg1, "class", "btn-icon filled");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "512");
    			attr_dev(svg1, "height", "512");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			add_location(svg1, file$3, 157, 12, 3942);
    			attr_dev(a1, "href", a1_href_value = "whatsapp://send?text=" + location.href);
    			attr_dev(a1, "data-action", "share/whatsapp/share");
    			attr_dev(a1, "class", "svelte-3zzsfh");
    			add_location(a1, file$3, 154, 10, 3823);
    			add_location(title2, file$3, 180, 14, 5708);
    			attr_dev(path2, "d", "M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2,278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z");
    			add_location(path2, file$3, 181, 14, 5758);
    			attr_dev(svg2, "class", "btn-icon filled");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "512");
    			attr_dev(svg2, "height", "512");
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			add_location(svg2, file$3, 174, 12, 5512);
    			attr_dev(a2, "href", a2_href_value = "https://twitter.com/share?url=" + location.href);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-3zzsfh");
    			add_location(a2, file$3, 171, 10, 5403);
    			attr_dev(div, "class", "shareButtons svelte-3zzsfh");
    			add_location(div, file$3, 130, 8, 2873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, title0);
    			append_dev(title0, t0);
    			append_dev(svg0, path0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, title1);
    			append_dev(title1, t2);
    			append_dev(svg1, path1);
    			append_dev(div, t3);
    			append_dev(div, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, title2);
    			append_dev(title2, t4);
    			append_dev(svg2, path2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(130:34) ",
    		ctx
    	});

    	return block;
    }

    // (100:6) {#if action == 'search'}
    function create_if_block_5(ctx) {
    	let div;
    	let t;
    	let input;
    	let mounted;
    	let dispose;
    	let if_block = /*LAST_SEARCH*/ ctx[1] && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			input = element("input");
    			attr_dev(input, "id", "searchBox");
    			attr_dev(input, "type", "searchBox");
    			attr_dev(input, "placeholder", "¿ Qué necesita ?");
    			attr_dev(input, "class", "svelte-3zzsfh");
    			add_location(input, file$3, 115, 10, 2451);
    			attr_dev(div, "class", "search");
    			add_location(div, file$3, 100, 8, 2041);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*QUERY*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", focus_handler, false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[8], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*LAST_SEARCH*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*QUERY*/ 1) {
    				set_input_value(input, /*QUERY*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(100:6) {#if action == 'search'}",
    		ctx
    	});

    	return block;
    }

    // (102:10) {#if LAST_SEARCH}
    function create_if_block_6(ctx) {
    	let h1;
    	let t1;
    	let ul;
    	let each_value = /*LAST_SEARCH*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Búsquedas recientes";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-3zzsfh");
    			add_location(h1, file$3, 102, 12, 2102);
    			attr_dev(ul, "class", "svelte-3zzsfh");
    			add_location(ul, file$3, 103, 12, 2143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*active, QUERY, LAST_SEARCH*/ 19) {
    				each_value = /*LAST_SEARCH*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(102:10) {#if LAST_SEARCH}",
    		ctx
    	});

    	return block;
    }

    // (105:14) {#each LAST_SEARCH as item}
    function create_each_block$1(ctx) {
    	let li;
    	let t0_value = /*item*/ ctx[15] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[7](/*item*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "svelte-3zzsfh");
    			add_location(li, file$3, 105, 16, 2206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*LAST_SEARCH*/ 2 && t0_value !== (t0_value = /*item*/ ctx[15] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(105:14) {#each LAST_SEARCH as item}",
    		ctx
    	});

    	return block;
    }

    // (201:47) {:else}
    function create_else_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("share");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(201:47) {:else}",
    		ctx
    	});

    	return block;
    }

    // (201:8) {#if active && action === 'share'}
    function create_if_block_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(201:8) {#if active && action === 'share'}",
    		ctx
    	});

    	return block;
    }

    // (233:48) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("search");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(233:48) {:else}",
    		ctx
    	});

    	return block;
    }

    // (233:8) {#if active && action === 'search'}
    function create_if_block_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(233:8) {#if active && action === 'search'}",
    		ctx
    	});

    	return block;
    }

    // (244:46) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("visibility");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(244:46) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:8) {#if showProductOnStock}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("visibility_off");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(244:8) {#if showProductOnStock}",
    		ctx
    	});

    	return block;
    }

    // (258:29) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("menu");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(258:29) {:else}",
    		ctx
    	});

    	return block;
    }

    // (258:8) {#if isOpenMenu}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(258:8) {#if isOpenMenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let nav;
    	let t0;
    	let div6;
    	let div0;
    	let i0;
    	let t1;
    	let div1;
    	let a0;
    	let i1;
    	let t3;
    	let div2;
    	let a1;
    	let i2;
    	let t5;
    	let div3;
    	let i3;
    	let t6;
    	let div4;
    	let i4;
    	let t7;
    	let div5;
    	let i5;
    	let mounted;
    	let dispose;
    	let if_block0 = /*active*/ ctx[4] && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*active*/ ctx[4] && /*action*/ ctx[5] === "share") return create_if_block_3$1;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*active*/ ctx[4] && /*action*/ ctx[5] === "search") return create_if_block_2$2;
    		return create_else_block_2;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (/*showProductOnStock*/ ctx[2]) return create_if_block_1$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type_2 = select_block_type_3(ctx);
    	let if_block3 = current_block_type_2(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*isOpenMenu*/ ctx[3]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type_3 = select_block_type_4(ctx);
    	let if_block4 = current_block_type_3(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div6 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			i1 = element("i");
    			i1.textContent = "phone";
    			t3 = space();
    			div2 = element("div");
    			a1 = element("a");
    			i2 = element("i");
    			i2.textContent = "chat";
    			t5 = space();
    			div3 = element("div");
    			i3 = element("i");
    			if_block2.c();
    			t6 = space();
    			div4 = element("div");
    			i4 = element("i");
    			if_block3.c();
    			t7 = space();
    			div5 = element("div");
    			i5 = element("i");
    			if_block4.c();
    			attr_dev(i0, "title", "Compartir");
    			attr_dev(i0, "action", "share");
    			attr_dev(i0, "class", "material-icons btn-icon");
    			add_location(i0, file$3, 195, 6, 6586);
    			add_location(div0, file$3, 194, 4, 6574);
    			attr_dev(i1, "class", "material-icons btn-icon");
    			add_location(i1, file$3, 207, 8, 6924);
    			attr_dev(a0, "href", "tel:+5493815900868");
    			attr_dev(a0, "title", "Llamar");
    			attr_dev(a0, "class", "svelte-3zzsfh");
    			add_location(a0, file$3, 206, 6, 6871);
    			add_location(div1, file$3, 205, 4, 6859);
    			attr_dev(i2, "class", "material-icons btn-icon");
    			add_location(i2, file$3, 218, 8, 7191);
    			attr_dev(a1, "href", "https://m.me/100010196598541");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener");
    			attr_dev(a1, "title", "Chatear");
    			attr_dev(a1, "class", "svelte-3zzsfh");
    			add_location(a1, file$3, 213, 6, 7064);
    			add_location(div2, file$3, 212, 4, 7052);
    			attr_dev(i3, "title", "Buscar");
    			attr_dev(i3, "class", "material-icons btn-icon");
    			add_location(i3, file$3, 224, 6, 7332);
    			add_location(div3, file$3, 223, 4, 7320);
    			attr_dev(i4, "class", "material-icons btn-icon");
    			attr_dev(i4, "title", "Todos los productos");
    			add_location(i4, file$3, 239, 6, 7714);
    			add_location(div4, file$3, 238, 4, 7702);
    			attr_dev(i5, "title", "Menú");
    			attr_dev(i5, "class", "material-icons btn-icon");
    			add_location(i5, file$3, 250, 6, 8041);
    			add_location(div5, file$3, 249, 4, 8029);
    			attr_dev(div6, "class", "fixedIcons svelte-3zzsfh");
    			add_location(div6, file$3, 191, 2, 6518);
    			attr_dev(nav, "id", "nav");
    			attr_dev(nav, "class", "svelte-3zzsfh");
    			add_location(nav, file$3, 93, 0, 1861);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if (if_block0) if_block0.m(nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, div6);
    			append_dev(div6, div0);
    			append_dev(div0, i0);
    			if_block1.m(i0, null);
    			append_dev(div6, t1);
    			append_dev(div6, div1);
    			append_dev(div1, a0);
    			append_dev(a0, i1);
    			append_dev(div6, t3);
    			append_dev(div6, div2);
    			append_dev(div2, a1);
    			append_dev(a1, i2);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, i3);
    			if_block2.m(i3, null);
    			append_dev(div6, t6);
    			append_dev(div6, div4);
    			append_dev(div4, i4);
    			if_block3.m(i4, null);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, i5);
    			if_block4.m(i5, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(i0, "click", /*btnShare*/ ctx[6], true, false, false),
    					listen_dev(i3, "click", /*click_handler_1*/ ctx[10], false, false, false),
    					listen_dev(i4, "click", /*click_handler_2*/ ctx[11], false, false, false),
    					listen_dev(i5, "click", /*click_handler_3*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(nav, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(i0, null);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_2(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(i3, null);
    				}
    			}

    			if (current_block_type_2 !== (current_block_type_2 = select_block_type_3(ctx))) {
    				if_block3.d(1);
    				if_block3 = current_block_type_2(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(i4, null);
    				}
    			}

    			if (current_block_type_3 !== (current_block_type_3 = select_block_type_4(ctx))) {
    				if_block4.d(1);
    				if_block4 = current_block_type_3(ctx);

    				if (if_block4) {
    					if_block4.c();
    					if_block4.m(i5, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			if_block3.d();
    			if_block4.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const focus_handler = e => {
    	e.target.value.trim();
    	e.target.select();
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { QUERY } = $$props,
    		{ LAST_SEARCH } = $$props,
    		{ showProductOnStock } = $$props,
    		{ isOpenMenu } = $$props;

    	const serachSuggestions = [
    		"Sony",
    		"Flashes",
    		"Nikon",
    		"Canon",
    		"Godox",
    		"Zhiyun-tech",
    		"Usados Seleccionados"
    	];

    	let active = false;
    	let action = "share";

    	function floatContainer(el) {
    		$$invalidate(4, active = !active);
    		const icon = el.target;
    		if (icon.getAttribute("action")) $$invalidate(5, action = icon.getAttribute("action"));
    	}

    	async function btnShare() {
    		copyToClipboard(window.location);
    		console.log(`Copied to clipboard: '${window.location}'`);

    		if (navigator.share) {
    			await navigator.share({
    				title: document.title,
    				url: window.location
    			});
    		} else {
    			$$invalidate(5, action = "share");
    			$$invalidate(4, active = !active);
    			if (active) $$invalidate(3, isOpenMenu = false);
    		}
    	}

    	const writable_props = ["QUERY", "LAST_SEARCH", "showProductOnStock", "isOpenMenu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Footer", $$slots, []);

    	const click_handler = item => {
    		$$invalidate(4, active = false);
    		$$invalidate(0, QUERY = item);
    	};

    	const change_handler = () => {
    		$$invalidate(4, active = false);
    	};

    	function input_input_handler() {
    		QUERY = this.value;
    		$$invalidate(0, QUERY);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(4, active = !active);
    		if (active) $$invalidate(3, isOpenMenu = false);
    		$$invalidate(5, action = "search");
    	};

    	const click_handler_2 = () => $$invalidate(2, showProductOnStock = !showProductOnStock);

    	const click_handler_3 = () => {
    		$$invalidate(3, isOpenMenu = !isOpenMenu);
    		if (isOpenMenu) $$invalidate(4, active = false);
    	};

    	$$self.$set = $$props => {
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("LAST_SEARCH" in $$props) $$invalidate(1, LAST_SEARCH = $$props.LAST_SEARCH);
    		if ("showProductOnStock" in $$props) $$invalidate(2, showProductOnStock = $$props.showProductOnStock);
    		if ("isOpenMenu" in $$props) $$invalidate(3, isOpenMenu = $$props.isOpenMenu);
    	};

    	$$self.$capture_state = () => ({
    		QUERY,
    		LAST_SEARCH,
    		showProductOnStock,
    		isOpenMenu,
    		serachSuggestions,
    		active,
    		action,
    		floatContainer,
    		btnShare
    	});

    	$$self.$inject_state = $$props => {
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("LAST_SEARCH" in $$props) $$invalidate(1, LAST_SEARCH = $$props.LAST_SEARCH);
    		if ("showProductOnStock" in $$props) $$invalidate(2, showProductOnStock = $$props.showProductOnStock);
    		if ("isOpenMenu" in $$props) $$invalidate(3, isOpenMenu = $$props.isOpenMenu);
    		if ("active" in $$props) $$invalidate(4, active = $$props.active);
    		if ("action" in $$props) $$invalidate(5, action = $$props.action);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*LAST_SEARCH*/ 2) {
    			 if (LAST_SEARCH) {
    				$$invalidate(1, LAST_SEARCH = [...LAST_SEARCH, ...serachSuggestions].slice(0, 7));
    			} else $$invalidate(1, LAST_SEARCH = [...serachSuggestions]);
    		}
    	};

    	return [
    		QUERY,
    		LAST_SEARCH,
    		showProductOnStock,
    		isOpenMenu,
    		active,
    		action,
    		btnShare,
    		click_handler,
    		change_handler,
    		input_input_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			QUERY: 0,
    			LAST_SEARCH: 1,
    			showProductOnStock: 2,
    			isOpenMenu: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*QUERY*/ ctx[0] === undefined && !("QUERY" in props)) {
    			console_1$1.warn("<Footer> was created without expected prop 'QUERY'");
    		}

    		if (/*LAST_SEARCH*/ ctx[1] === undefined && !("LAST_SEARCH" in props)) {
    			console_1$1.warn("<Footer> was created without expected prop 'LAST_SEARCH'");
    		}

    		if (/*showProductOnStock*/ ctx[2] === undefined && !("showProductOnStock" in props)) {
    			console_1$1.warn("<Footer> was created without expected prop 'showProductOnStock'");
    		}

    		if (/*isOpenMenu*/ ctx[3] === undefined && !("isOpenMenu" in props)) {
    			console_1$1.warn("<Footer> was created without expected prop 'isOpenMenu'");
    		}
    	}

    	get QUERY() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set QUERY(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get LAST_SEARCH() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set LAST_SEARCH(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProductOnStock() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProductOnStock(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpenMenu() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpenMenu(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Aside.svelte generated by Svelte v3.24.0 */

    const file$4 = "src/Components/Aside.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (126:10) {#if PRODUCTS_TYPES}
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*PRODUCTS_TYPES*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newSearch, PRODUCTS_TYPES*/ 10) {
    				each_value_1 = /*PRODUCTS_TYPES*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(126:10) {#if PRODUCTS_TYPES}",
    		ctx
    	});

    	return block;
    }

    // (127:12) {#each PRODUCTS_TYPES as item, i}
    function create_each_block_1(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[9] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*item*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-6ubjj1");
    			add_location(li, file$4, 127, 14, 3487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*PRODUCTS_TYPES*/ 2 && t_value !== (t_value = /*item*/ ctx[9] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(127:12) {#each PRODUCTS_TYPES as item, i}",
    		ctx
    	});

    	return block;
    }

    // (135:10) {#if BRANDS}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*BRANDS*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newSearch, BRANDS*/ 12) {
    				each_value = /*BRANDS*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(135:10) {#if BRANDS}",
    		ctx
    	});

    	return block;
    }

    // (136:12) {#each BRANDS as item, i}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[9] + "";
    	let t;
    	let li_id_value;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[6](/*item*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "id", li_id_value = /*i*/ ctx[11]);
    			attr_dev(li, "class", "svelte-6ubjj1");
    			add_location(li, file$4, 136, 14, 3725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*BRANDS*/ 4 && t_value !== (t_value = /*item*/ ctx[9] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(136:12) {#each BRANDS as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let aside;
    	let nav;
    	let input0;
    	let t0;
    	let label0;
    	let t2;
    	let input1;
    	let t3;
    	let label1;
    	let t5;
    	let section;
    	let div0;
    	let ul0;
    	let t6;
    	let div1;
    	let ul1;
    	let if_block0 = /*PRODUCTS_TYPES*/ ctx[1] && create_if_block_1$3(ctx);
    	let if_block1 = /*BRANDS*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			nav = element("nav");
    			input0 = element("input");
    			t0 = space();
    			label0 = element("label");
    			label0.textContent = "Rubros";
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			label1 = element("label");
    			label1.textContent = "Marcas";
    			t5 = space();
    			section = element("section");
    			div0 = element("div");
    			ul0 = element("ul");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			div1 = element("div");
    			ul1 = element("ul");
    			if (if_block1) if_block1.c();
    			attr_dev(input0, "class", "inputs svelte-6ubjj1");
    			input0.checked = true;
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "opt");
    			attr_dev(input0, "id", "op-1");
    			add_location(input0, file$4, 118, 4, 3127);
    			attr_dev(label0, "for", "op-1");
    			attr_dev(label0, "class", "svelte-6ubjj1");
    			add_location(label0, file$4, 119, 4, 3198);
    			attr_dev(input1, "class", "inputs svelte-6ubjj1");
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "opt");
    			attr_dev(input1, "id", "op-2");
    			add_location(input1, file$4, 120, 4, 3235);
    			attr_dev(label1, "for", "op-2");
    			attr_dev(label1, "class", "svelte-6ubjj1");
    			add_location(label1, file$4, 121, 4, 3298);
    			attr_dev(ul0, "class", "svelte-6ubjj1");
    			add_location(ul0, file$4, 124, 8, 3391);
    			attr_dev(div0, "class", "content content-1 svelte-6ubjj1");
    			add_location(div0, file$4, 123, 6, 3351);
    			attr_dev(ul1, "class", "svelte-6ubjj1");
    			add_location(ul1, file$4, 133, 8, 3645);
    			attr_dev(div1, "class", "content content-2 svelte-6ubjj1");
    			add_location(div1, file$4, 132, 6, 3605);
    			attr_dev(section, "class", "svelte-6ubjj1");
    			add_location(section, file$4, 122, 4, 3335);
    			attr_dev(nav, "class", "svelte-6ubjj1");
    			add_location(nav, file$4, 117, 2, 3117);
    			attr_dev(aside, "class", "asideMenu svelte-6ubjj1");
    			attr_dev(aside, "id", "asideMenu");
    			toggle_class(aside, "isOpenMenu", /*isOpenMenu*/ ctx[0]);
    			add_location(aside, file$4, 116, 0, 3057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, nav);
    			append_dev(nav, input0);
    			append_dev(nav, t0);
    			append_dev(nav, label0);
    			append_dev(nav, t2);
    			append_dev(nav, input1);
    			append_dev(nav, t3);
    			append_dev(nav, label1);
    			append_dev(nav, t5);
    			append_dev(nav, section);
    			append_dev(section, div0);
    			append_dev(div0, ul0);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(section, t6);
    			append_dev(section, div1);
    			append_dev(div1, ul1);
    			if (if_block1) if_block1.m(ul1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*PRODUCTS_TYPES*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(ul0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*BRANDS*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(ul1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*isOpenMenu*/ 1) {
    				toggle_class(aside, "isOpenMenu", /*isOpenMenu*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { PRODUCTS_TYPES } = $$props,
    		{ BRANDS } = $$props,
    		{ QUERY } = $$props,
    		{ isOpenMenu } = $$props;

    	function openMenu() {
    		if (document.getElementById("asideMenu")) {
    			$$invalidate(0, isOpenMenu = true);
    			document.getElementById("asideMenu").classList.add("active");
    		}
    	}

    	function closeMenu() {
    		if (document.getElementById("asideMenu")) {
    			$$invalidate(0, isOpenMenu = false);
    			document.getElementById("asideMenu").classList.remove("active");
    		}
    	}

    	function newSearch(query) {
    		$$invalidate(4, QUERY = query.trim());
    		window.saveSearch(query);
    		closeMenu();
    	}

    	const writable_props = ["PRODUCTS_TYPES", "BRANDS", "QUERY", "isOpenMenu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Aside> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Aside", $$slots, []);
    	const click_handler = item => newSearch(item);
    	const click_handler_1 = item => newSearch(item);

    	$$self.$set = $$props => {
    		if ("PRODUCTS_TYPES" in $$props) $$invalidate(1, PRODUCTS_TYPES = $$props.PRODUCTS_TYPES);
    		if ("BRANDS" in $$props) $$invalidate(2, BRANDS = $$props.BRANDS);
    		if ("QUERY" in $$props) $$invalidate(4, QUERY = $$props.QUERY);
    		if ("isOpenMenu" in $$props) $$invalidate(0, isOpenMenu = $$props.isOpenMenu);
    	};

    	$$self.$capture_state = () => ({
    		PRODUCTS_TYPES,
    		BRANDS,
    		QUERY,
    		isOpenMenu,
    		openMenu,
    		closeMenu,
    		newSearch
    	});

    	$$self.$inject_state = $$props => {
    		if ("PRODUCTS_TYPES" in $$props) $$invalidate(1, PRODUCTS_TYPES = $$props.PRODUCTS_TYPES);
    		if ("BRANDS" in $$props) $$invalidate(2, BRANDS = $$props.BRANDS);
    		if ("QUERY" in $$props) $$invalidate(4, QUERY = $$props.QUERY);
    		if ("isOpenMenu" in $$props) $$invalidate(0, isOpenMenu = $$props.isOpenMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpenMenu*/ 1) {
    			 if (isOpenMenu) openMenu(); else closeMenu();
    		}
    	};

    	return [
    		isOpenMenu,
    		PRODUCTS_TYPES,
    		BRANDS,
    		newSearch,
    		QUERY,
    		click_handler,
    		click_handler_1
    	];
    }

    class Aside extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			PRODUCTS_TYPES: 1,
    			BRANDS: 2,
    			QUERY: 4,
    			isOpenMenu: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Aside",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*PRODUCTS_TYPES*/ ctx[1] === undefined && !("PRODUCTS_TYPES" in props)) {
    			console.warn("<Aside> was created without expected prop 'PRODUCTS_TYPES'");
    		}

    		if (/*BRANDS*/ ctx[2] === undefined && !("BRANDS" in props)) {
    			console.warn("<Aside> was created without expected prop 'BRANDS'");
    		}

    		if (/*QUERY*/ ctx[4] === undefined && !("QUERY" in props)) {
    			console.warn("<Aside> was created without expected prop 'QUERY'");
    		}

    		if (/*isOpenMenu*/ ctx[0] === undefined && !("isOpenMenu" in props)) {
    			console.warn("<Aside> was created without expected prop 'isOpenMenu'");
    		}
    	}

    	get PRODUCTS_TYPES() {
    		throw new Error("<Aside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set PRODUCTS_TYPES(value) {
    		throw new Error("<Aside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get BRANDS() {
    		throw new Error("<Aside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set BRANDS(value) {
    		throw new Error("<Aside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get QUERY() {
    		throw new Error("<Aside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set QUERY(value) {
    		throw new Error("<Aside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpenMenu() {
    		throw new Error("<Aside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpenMenu(value) {
    		throw new Error("<Aside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Icons.svelte generated by Svelte v3.24.0 */

    const file$5 = "src/Components/Icons.svelte";

    // (33:0) {:else}
    function create_else_block$3(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("Icon '$");
    			t1 = text(/*iconName*/ ctx[0]);
    			t2 = text("' no math");
    			add_location(span, file$5, 33, 2, 1522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*iconName*/ 1) set_data_dev(t1, /*iconName*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(33:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if icons[iconName]}
    function create_if_block$4(ctx) {
    	let svg;
    	let raw_value = /*icons*/ ctx[3][/*iconName*/ ctx[0]] + "";
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			attr_dev(svg, "class", svg_class_value = "svg-icon " + /*iconName*/ ctx[0] + " svelte-14316x9");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "fill", /*fill*/ ctx[1]);
    			set_style(svg, "stroke", /*stroke*/ ctx[2]);
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$5, 25, 2, 1329);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*iconName*/ 1 && raw_value !== (raw_value = /*icons*/ ctx[3][/*iconName*/ ctx[0]] + "")) svg.innerHTML = raw_value;
    			if (dirty & /*iconName*/ 1 && svg_class_value !== (svg_class_value = "svg-icon " + /*iconName*/ ctx[0] + " svelte-14316x9")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(svg, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(svg, "stroke", /*stroke*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:0) {#if icons[iconName]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*icons*/ ctx[3][/*iconName*/ ctx[0]]) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { iconName } = $$props,
    		{ fill = "grey" } = $$props,
    		{ stroke = "grey" } = $$props,
    		{ title = "" } = $$props;

    	const icons = {
    		close: `<title>${title}</title>
            <line x1="430" y1="430" x2="144" y2="144" style="stroke-linecap: round;stroke-linejoin: round;stroke-width: 32px;" />
            <line x1="430" y1="144" x2="144" y2="430" style="stroke-linecap: round;stroke-linejoin: round;stroke-width: 32px;" />`,
    		twitter: `<title>${title}</title>
            <path d="M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2,278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z" />`,
    		removeOutline: `
    <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    `
    	};

    	const writable_props = ["iconName", "fill", "stroke", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icons> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Icons", $$slots, []);

    	$$self.$set = $$props => {
    		if ("iconName" in $$props) $$invalidate(0, iconName = $$props.iconName);
    		if ("fill" in $$props) $$invalidate(1, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ("title" in $$props) $$invalidate(4, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ iconName, fill, stroke, title, icons });

    	$$self.$inject_state = $$props => {
    		if ("iconName" in $$props) $$invalidate(0, iconName = $$props.iconName);
    		if ("fill" in $$props) $$invalidate(1, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ("title" in $$props) $$invalidate(4, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconName, fill, stroke, icons, title];
    }

    class Icons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			iconName: 0,
    			fill: 1,
    			stroke: 2,
    			title: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icons",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*iconName*/ ctx[0] === undefined && !("iconName" in props)) {
    			console.warn("<Icons> was created without expected prop 'iconName'");
    		}
    	}

    	get iconName() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Icons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Icons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/App.svelte generated by Svelte v3.24.0 */

    const { console: console_1$2 } = globals;
    const file$6 = "src/Components/App.svelte";

    // (331:2) {#if PRODUCTS_SHOWED}
    function create_if_block$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let aside;
    	let updating_QUERY;
    	let updating_isOpenMenu;
    	let t1;
    	let footer;
    	let updating_QUERY_1;
    	let updating_LAST_SEARCH;
    	let updating_showProductOnStock;
    	let updating_isOpenMenu_1;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*PRODUCTS_SHOWED*/ ctx[1].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function aside_QUERY_binding(value) {
    		/*aside_QUERY_binding*/ ctx[10].call(null, value);
    	}

    	function aside_isOpenMenu_binding(value) {
    		/*aside_isOpenMenu_binding*/ ctx[11].call(null, value);
    	}

    	let aside_props = {
    		PRODUCTS_TYPES: /*PRODUCTS_TYPES*/ ctx[3],
    		BRANDS: /*BRANDS*/ ctx[4]
    	};

    	if (/*QUERY*/ ctx[0] !== void 0) {
    		aside_props.QUERY = /*QUERY*/ ctx[0];
    	}

    	if (/*isOpenMenu*/ ctx[7] !== void 0) {
    		aside_props.isOpenMenu = /*isOpenMenu*/ ctx[7];
    	}

    	aside = new Aside({ props: aside_props, $$inline: true });
    	binding_callbacks.push(() => bind(aside, "QUERY", aside_QUERY_binding));
    	binding_callbacks.push(() => bind(aside, "isOpenMenu", aside_isOpenMenu_binding));

    	function footer_QUERY_binding(value) {
    		/*footer_QUERY_binding*/ ctx[12].call(null, value);
    	}

    	function footer_LAST_SEARCH_binding(value) {
    		/*footer_LAST_SEARCH_binding*/ ctx[13].call(null, value);
    	}

    	function footer_showProductOnStock_binding(value) {
    		/*footer_showProductOnStock_binding*/ ctx[14].call(null, value);
    	}

    	function footer_isOpenMenu_binding(value) {
    		/*footer_isOpenMenu_binding*/ ctx[15].call(null, value);
    	}

    	let footer_props = {};

    	if (/*QUERY*/ ctx[0] !== void 0) {
    		footer_props.QUERY = /*QUERY*/ ctx[0];
    	}

    	if (/*LAST_SEARCH*/ ctx[2] !== void 0) {
    		footer_props.LAST_SEARCH = /*LAST_SEARCH*/ ctx[2];
    	}

    	if (/*showProductOnStock*/ ctx[6] !== void 0) {
    		footer_props.showProductOnStock = /*showProductOnStock*/ ctx[6];
    	}

    	if (/*isOpenMenu*/ ctx[7] !== void 0) {
    		footer_props.isOpenMenu = /*isOpenMenu*/ ctx[7];
    	}

    	footer = new Footer({ props: footer_props, $$inline: true });
    	binding_callbacks.push(() => bind(footer, "QUERY", footer_QUERY_binding));
    	binding_callbacks.push(() => bind(footer, "LAST_SEARCH", footer_LAST_SEARCH_binding));
    	binding_callbacks.push(() => bind(footer, "showProductOnStock", footer_showProductOnStock_binding));
    	binding_callbacks.push(() => bind(footer, "isOpenMenu", footer_isOpenMenu_binding));

    	const block = {
    		c: function create() {
    			if_block.c();
    			t0 = space();
    			create_component(aside.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(aside, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(t0.parentNode, t0);
    			}

    			const aside_changes = {};
    			if (dirty & /*PRODUCTS_TYPES*/ 8) aside_changes.PRODUCTS_TYPES = /*PRODUCTS_TYPES*/ ctx[3];
    			if (dirty & /*BRANDS*/ 16) aside_changes.BRANDS = /*BRANDS*/ ctx[4];

    			if (!updating_QUERY && dirty & /*QUERY*/ 1) {
    				updating_QUERY = true;
    				aside_changes.QUERY = /*QUERY*/ ctx[0];
    				add_flush_callback(() => updating_QUERY = false);
    			}

    			if (!updating_isOpenMenu && dirty & /*isOpenMenu*/ 128) {
    				updating_isOpenMenu = true;
    				aside_changes.isOpenMenu = /*isOpenMenu*/ ctx[7];
    				add_flush_callback(() => updating_isOpenMenu = false);
    			}

    			aside.$set(aside_changes);
    			const footer_changes = {};

    			if (!updating_QUERY_1 && dirty & /*QUERY*/ 1) {
    				updating_QUERY_1 = true;
    				footer_changes.QUERY = /*QUERY*/ ctx[0];
    				add_flush_callback(() => updating_QUERY_1 = false);
    			}

    			if (!updating_LAST_SEARCH && dirty & /*LAST_SEARCH*/ 4) {
    				updating_LAST_SEARCH = true;
    				footer_changes.LAST_SEARCH = /*LAST_SEARCH*/ ctx[2];
    				add_flush_callback(() => updating_LAST_SEARCH = false);
    			}

    			if (!updating_showProductOnStock && dirty & /*showProductOnStock*/ 64) {
    				updating_showProductOnStock = true;
    				footer_changes.showProductOnStock = /*showProductOnStock*/ ctx[6];
    				add_flush_callback(() => updating_showProductOnStock = false);
    			}

    			if (!updating_isOpenMenu_1 && dirty & /*isOpenMenu*/ 128) {
    				updating_isOpenMenu_1 = true;
    				footer_changes.isOpenMenu = /*isOpenMenu*/ ctx[7];
    				add_flush_callback(() => updating_isOpenMenu_1 = false);
    			}

    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(aside.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(aside.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(aside, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(331:2) {#if PRODUCTS_SHOWED}",
    		ctx
    	});

    	return block;
    }

    // (338:4) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let h2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "No hay productos con esa descripción :(";
    			attr_dev(h2, "class", "svelte-fbbdtu");
    			add_location(h2, file$6, 339, 8, 8628);
    			attr_dev(div, "class", "noProducts svelte-fbbdtu");
    			add_location(div, file$6, 338, 6, 8595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(338:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (332:4) {#if PRODUCTS_SHOWED.length}
    function create_if_block_1$4(ctx) {
    	let productlist;
    	let updating_QUERY;
    	let updating_showProductOnStock;
    	let current;

    	function productlist_QUERY_binding(value) {
    		/*productlist_QUERY_binding*/ ctx[8].call(null, value);
    	}

    	function productlist_showProductOnStock_binding(value) {
    		/*productlist_showProductOnStock_binding*/ ctx[9].call(null, value);
    	}

    	let productlist_props = {
    		PRODUCTS_SHOWED: /*PRODUCTS_SHOWED*/ ctx[1],
    		ONLINE: /*ONLINE*/ ctx[5]
    	};

    	if (/*QUERY*/ ctx[0] !== void 0) {
    		productlist_props.QUERY = /*QUERY*/ ctx[0];
    	}

    	if (/*showProductOnStock*/ ctx[6] !== void 0) {
    		productlist_props.showProductOnStock = /*showProductOnStock*/ ctx[6];
    	}

    	productlist = new ProductList({ props: productlist_props, $$inline: true });
    	binding_callbacks.push(() => bind(productlist, "QUERY", productlist_QUERY_binding));
    	binding_callbacks.push(() => bind(productlist, "showProductOnStock", productlist_showProductOnStock_binding));

    	const block = {
    		c: function create() {
    			create_component(productlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(productlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const productlist_changes = {};
    			if (dirty & /*PRODUCTS_SHOWED*/ 2) productlist_changes.PRODUCTS_SHOWED = /*PRODUCTS_SHOWED*/ ctx[1];
    			if (dirty & /*ONLINE*/ 32) productlist_changes.ONLINE = /*ONLINE*/ ctx[5];

    			if (!updating_QUERY && dirty & /*QUERY*/ 1) {
    				updating_QUERY = true;
    				productlist_changes.QUERY = /*QUERY*/ ctx[0];
    				add_flush_callback(() => updating_QUERY = false);
    			}

    			if (!updating_showProductOnStock && dirty & /*showProductOnStock*/ 64) {
    				updating_showProductOnStock = true;
    				productlist_changes.showProductOnStock = /*showProductOnStock*/ ctx[6];
    				add_flush_callback(() => updating_showProductOnStock = false);
    			}

    			productlist.$set(productlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(332:4) {#if PRODUCTS_SHOWED.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let header;
    	let t;
    	let current;
    	header = new Header({ $$inline: true });
    	let if_block = /*PRODUCTS_SHOWED*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-fbbdtu");
    			add_location(main, file$6, 323, 0, 8244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*PRODUCTS_SHOWED*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*PRODUCTS_SHOWED*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function saveSearch(str) {
    	let store = getFromLocal("lastSearch");
    	if (!store) store = [];
    	store = [...new Set([str, ...store])].slice(0, 7);
    	setToLocal("lastSearch", store);
    }

    const limitOfResultToShow = 100;
    const urlOfData = "https://spreadsheets.google.com/feeds/list/1FjerBKgvNepZfQkPaUbd9DMy5-SMr-XxEKeNsZhcPM4/od6/public/values?alt=json";

    function setToLocal(key, value) {
    	try {
    		localStorage.setItem(key, JSON.stringify(value));
    	} catch(error) {
    		console.error(error);
    	}
    }

    function getFromLocal(key) {
    	try {
    		return JSON.parse(localStorage.getItem(key));
    	} catch(error) {
    		console.error(error);
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	console.clear();

    	let QUERY,
    		PRODUCTS,
    		PRODUCTS_SHOWED,
    		LAST_SEARCH,
    		CATEGORIES,
    		PRODUCTS_TYPES,
    		BRANDS,
    		ONLINE = false;

    	window.setOfBrand = new Set();
    	let showProductOnStock = false;
    	let isOpenMenu = false;

    	onMount(async () => {
    		try {
    			$$invalidate(0, QUERY = "");

    			// FROM LOCAL
    			if (getFromLocal("Query")) {
    				$$invalidate(0, QUERY = getFromLocal("Query").replace(/\\|#/gi, ""));
    			}

    			// FROM URL
    			if (location.hash.slice(1)) {
    				$$invalidate(0, QUERY = decodeURI(location.hash.replace(/(_)/g, " ").replace(/(\\|#)/gi, "")));
    			}

    			PRODUCTS = getFromLocal("Products");
    			CATEGORIES = getFromLocal("Categories");
    			$$invalidate(3, PRODUCTS_TYPES = getFromLocal("ProductsTypes"));
    			$$invalidate(4, BRANDS = getFromLocal("Brands"));

    			// FROM NETWORK
    			PRODUCTS = await updateProducts();

    			searchOnList();

    			// TIMER
    			const timer = setInterval(
    				async () => {
    					PRODUCTS = await updateProducts();
    					searchOnList();
    				},
    				60 * 60000
    			);
    		} catch(error) {
    			console.error(error);
    		}
    	});

    	// ------------------------------------
    	// Update list of product from source
    	// ------------------------------------
    	async function updateProducts() {
    		try {
    			const data = await fechingData(urlOfData);
    			return data;
    		} catch(error) {
    			console.error(error);
    		}
    	}

    	// ------------------------------------
    	// Search $Query on list to be displayed
    	// ------------------------------------
    	function searchOnList(str = QUERY) {
    		if (!PRODUCTS) return;
    		let results;

    		if (!!str) {
    			// Search products by str
    			str = str.trim();

    			location.hash = str.replace(/( )/g, "_"); // Update location.hash
    			setToLocal("Query", str);

    			results = PRODUCTS.filter(item => {
    				try {
    					const expession = new RegExp(escapeRegExp(str), "gi");
    					console.info(`Serching: ${expession}`);
    					return item.name.match(expession) || item.brand.match(expession) || item.categorie.match(expession) || item.productType.match(expession);
    				} catch(error) {
    					console.error(error);
    					return false;
    				} // Try
    			});

    			results = sortObjetcByKey(results, "name"); // Order results
    		} else // Show shuffle default results
    		{
    			results = PRODUCTS.sort(() => Math.random() - 0.5);
    		}

    		results = results.slice(0, limitOfResultToShow); // Cut results to limit
    		$$invalidate(1, PRODUCTS_SHOWED = results);
    		$$invalidate(2, LAST_SEARCH = getFromLocal("lastSearch"));

    		function escapeRegExp(text) {
    			try {
    				// return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    				return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    			} catch(error) {
    				console.error(error);
    				return "";
    			}
    		} // escapeRegExp()
    	}

    	// ------------------------------------
    	// Get JSON from Google
    	// ------------------------------------
    	async function fechingData(url) {
    		try {
    			console.time("Fething data from database");
    			const response = await fetch(url);
    			const data = await response.json();
    			console.timeEnd("Fething data from database");
    			return parseData(data.feed.entry);
    		} catch(error) {
    			console.error(error);
    		}
    	}

    	// ------------------------------------
    	// Prepare and filter data
    	// ------------------------------------
    	function parseData(data) {
    		//let categories = [];
    		//let productsTypes = [];
    		//let brands = [];
    		const brands = new Set(), productsTypes = new Set(), categories = new Set();

    		let results = data.reduce(
    			(accu, item, i) => {
    				// Verifica Stock, Activo, Web
    				if (item.gsx$act.$t !== "*" || item.gsx$web.$t !== "*" || item.gsx$stock.$t == "") return accu;

    				const id = i;
    				let { gsx$producto: { $t: name }, gsx$pvp: { $t: price }, gsx$fin: { $t: feeAmount }, gsx$cuotas: { $t: feeValue }, gsx$stock: { $t: stock }, gsx$d: { $t: ofert }, gsx$categoria: { $t: categorie }, gsx$rubro: { $t: productType }, gsx$marca: { $t: brand }, gsx$gtia: { $t: warranty }, gsx$desc: { $t: description }, gsx$img: { $t: image }, gsx$act: { $t: active }, gsx$web: { $t: activeForWeb }, id: { $t: link }, updated: { $t: updated } } = item;
    				ofert = !!ofert;
    				active = !!active;
    				activeForWeb = !!activeForWeb;

    				const toAdd = {
    					id,
    					active,
    					activeForWeb,
    					name,
    					price,
    					feeAmount,
    					feeValue,
    					stock,
    					ofert,
    					categorie,
    					productType,
    					brand,
    					warranty,
    					description,
    					image,
    					link,
    					updated
    				};

    				accu = [...accu, toAdd];

    				// categories = [...categories, categorie.capitalize()];
    				// productsTypes = [...productsTypes, productType.capitalize()];
    				// brands = [...brands, brand.capitalize()];
    				brands.add(brand.capitalize());

    				productsTypes.add(productType.capitalize());
    				categories.add(categorie.capitalize());
    				return accu;
    			},
    			[]
    		); // Reduce

    		$$invalidate(5, ONLINE = true);
    		CATEGORIES = [...categories].sort();
    		setToLocal("Categories", CATEGORIES);
    		$$invalidate(3, PRODUCTS_TYPES = [...productsTypes].sort());
    		setToLocal("ProductsTypes", PRODUCTS_TYPES);
    		$$invalidate(4, BRANDS = [...brands].sort());
    		setToLocal("Brands", BRANDS);
    		results = [...sortObjetcByKey(results, "name")];
    		setToLocal("Products", results);
    		return results;
    	}

    	/**
     * Save last search
     */
    	window.saveSearch = str => {
    		let store = getFromLocal("lastSearch");
    		if (!store) store = [];
    		store = [...new Set([str, ...store])].slice(0, 7);
    		setToLocal("lastSearch", store);
    	};

    	/**
     * * Capitalize the first letter of each word of a given string
     * * Usage: 'capItalezE aLl fIrSt leTTers'.capitalize()
     */
    	String.prototype.capitalize = function () {
    		try {
    			return this.split(" ").filter(value => value).reduce((text, word) => text + " " + word[0].toUpperCase() + word.substr(1).toLowerCase(), ""); // Reduce
    		} catch(error) {
    			console.info(`Error: '${this}'.capitalize()'`);
    			return this;
    		}
    	};

    	/**
     * * Copy text to clipboard
     * * Usage: copyToClipboard("Text to Copy");
     */
    	window.copyToClipboard = textToCopy => {
    		try {
    			let el = document.createElement("textarea");
    			el.value = textToCopy;
    			document.body.appendChild(el);
    			el.select();
    			document.execCommand("copy");
    			document.body.removeChild(el);
    			console.info(`Text copied: ${textToCopy}`);
    		} catch(error) {
    			console.error(error);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function productlist_QUERY_binding(value) {
    		QUERY = value;
    		$$invalidate(0, QUERY);
    	}

    	function productlist_showProductOnStock_binding(value) {
    		showProductOnStock = value;
    		$$invalidate(6, showProductOnStock);
    	}

    	function aside_QUERY_binding(value) {
    		QUERY = value;
    		$$invalidate(0, QUERY);
    	}

    	function aside_isOpenMenu_binding(value) {
    		isOpenMenu = value;
    		$$invalidate(7, isOpenMenu);
    	}

    	function footer_QUERY_binding(value) {
    		QUERY = value;
    		$$invalidate(0, QUERY);
    	}

    	function footer_LAST_SEARCH_binding(value) {
    		LAST_SEARCH = value;
    		$$invalidate(2, LAST_SEARCH);
    	}

    	function footer_showProductOnStock_binding(value) {
    		showProductOnStock = value;
    		$$invalidate(6, showProductOnStock);
    	}

    	function footer_isOpenMenu_binding(value) {
    		isOpenMenu = value;
    		$$invalidate(7, isOpenMenu);
    	}

    	$$self.$capture_state = () => ({
    		saveSearch,
    		sortObjetcByKey,
    		onMount,
    		Header,
    		ProductList,
    		Footer,
    		Aside,
    		Icon: Icons,
    		QUERY,
    		PRODUCTS,
    		PRODUCTS_SHOWED,
    		LAST_SEARCH,
    		CATEGORIES,
    		PRODUCTS_TYPES,
    		BRANDS,
    		ONLINE,
    		showProductOnStock,
    		isOpenMenu,
    		limitOfResultToShow,
    		urlOfData,
    		updateProducts,
    		searchOnList,
    		fechingData,
    		parseData,
    		setToLocal,
    		getFromLocal
    	});

    	$$self.$inject_state = $$props => {
    		if ("QUERY" in $$props) $$invalidate(0, QUERY = $$props.QUERY);
    		if ("PRODUCTS" in $$props) PRODUCTS = $$props.PRODUCTS;
    		if ("PRODUCTS_SHOWED" in $$props) $$invalidate(1, PRODUCTS_SHOWED = $$props.PRODUCTS_SHOWED);
    		if ("LAST_SEARCH" in $$props) $$invalidate(2, LAST_SEARCH = $$props.LAST_SEARCH);
    		if ("CATEGORIES" in $$props) CATEGORIES = $$props.CATEGORIES;
    		if ("PRODUCTS_TYPES" in $$props) $$invalidate(3, PRODUCTS_TYPES = $$props.PRODUCTS_TYPES);
    		if ("BRANDS" in $$props) $$invalidate(4, BRANDS = $$props.BRANDS);
    		if ("ONLINE" in $$props) $$invalidate(5, ONLINE = $$props.ONLINE);
    		if ("showProductOnStock" in $$props) $$invalidate(6, showProductOnStock = $$props.showProductOnStock);
    		if ("isOpenMenu" in $$props) $$invalidate(7, isOpenMenu = $$props.isOpenMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*QUERY*/ 1) {
    			 (searchOnList());
    		}
    	};

    	return [
    		QUERY,
    		PRODUCTS_SHOWED,
    		LAST_SEARCH,
    		PRODUCTS_TYPES,
    		BRANDS,
    		ONLINE,
    		showProductOnStock,
    		isOpenMenu,
    		productlist_QUERY_binding,
    		productlist_showProductOnStock_binding,
    		aside_QUERY_binding,
    		aside_isOpenMenu_binding,
    		footer_QUERY_binding,
    		footer_LAST_SEARCH_binding,
    		footer_showProductOnStock_binding,
    		footer_isOpenMenu_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {},
    });


    if ("serviceWorker" in navigator && location.hostname !== "192.168.1.50") {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").then(
          function (registration) {
            // Registration was successful
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            // registration failed :(
            console.error("ServiceWorker registration failed: ", err);
          }
        );
      });
    }
    else console.warn(`ServiceWorker no available.`);

    return app;

}());
//# sourceMappingURL=main.js.map
