/**
 * Kelas untuk mengatur routing di aplikasi single-page.
 * Mengelola navigasi, pemrosesan URL, dan memuat komponen berdasarkan rute yang dikonfigurasi.
 */
class Router {
    /**
     * Mengatur rute dengan menambahkan properti tambahan pada objek rute.
     * 
     * @private
     * @param {Array<Object>} routes - Daftar rute yang akan diatur.
     * @param {Object|null} [parent=null] - Rute induk jika ada, null jika tidak ada.
     * @returns {Array<Object>} Daftar rute yang telah diproses.
     */
    static setRoutes(routes = [], parent = null) {
        return routes.reduce((acc, curr) => {
            curr.parent = parent;
            curr.pathname = `${curr.parent?.pathname ?? ""}/${curr.path}`.replace(/\/+/g, "/");
            curr.pattern = `^${curr.pathname.replace(/:(\w+)/g, "(?<$1>[^/]+)").replace(/\*/, "(?:.*)")}(?:/?\$)`;
            curr.regexp = new RegExp(curr.pattern, "i");

            acc.push(curr);

            if (curr.children?.length) {
                acc.push(...this.setRoutes(curr.children, curr));
            }

            return acc;
        }, []);
    }

    /**
     * Mendapatkan path dari URL saat ini.
     * 
     * @returns {string} Path dari URL saat ini.
     */
    static get path() {
        return window.location.pathname;
    }

    /**
     * Mendapatkan rute yang sesuai dengan path saat ini.
     * 
     * @private
     * @returns {Object|null} Rute yang cocok atau null jika tidak ditemukan.
     */
    static getRoute() {
        return this.routes.find((route) => {
            const matches = this.path.match(route.regexp);

            this.params = { ...matches?.groups };

            return matches;
        });
    }

    /**
     * Mendapatkan seluruh jalur dari rute yang dipilih hingga induknya.
     * 
     * @private
     * @param {Object} route - Rute yang ingin diperiksa.
     * @returns {Array<Object>} Daftar rute dari yang dipilih hingga induknya.
     */
    static getRoutes(route = []) {
        return [route].reduce((acc, curr) => {
            if (curr.parent) {
                acc.push(...this.getRoutes(curr.parent));
            }

            acc.push(curr);

            return acc;
        }, []);
    }

    /**
     * Mendapatkan query parameters dari URL.
     * 
     * @returns {Object} Objek yang merepresentasikan pasangan key-value query parameters.
     */
    static get query() {
        const object = {};
        for (const [name, value] of new URLSearchParams(window.location.search)) {
            if (object[name]) {
                if (Array.isArray(object[name])) {
                    object[name].push(value);
                } else {
                    object[name] = [object[name], value];
                }
            } else {
                object[name] = value;
            }
        }
        return object;
    }

    /**
     * Menangani proses load halaman dan menavigasi ke rute yang sesuai.
     * 
     * @private
     * @returns {Promise<void>} Proses asinkron untuk menangani navigasi.
     */
    static async handleLoad() {
        const route = this.getRoute();
        const routes = this.getRoutes(route);

        if (this.abortController && !this.abortController.signal.aborted) {
            this.abortController.abort();
        }

        if (!this.abortController || (this.abortController && this.abortController.signal.aborted)) {
            this.abortController = new AbortController();
        }

        this.emit("onRouterCurrentEntryChange", this);

        for (const route of routes) {
            this.emit("onRouterNavigate", this);

            if (route.beforeLoad) {
                try {
                    await new Promise((resolve, reject) => {
                        const next = (err) => {
                            this.abortController.signal.removeEventListener("abort", next);

                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        };

                        route.beforeLoad(next);

                        this.abortController.signal.addEventListener("abort", next);
                    });
                } catch (error) {
                    this.emit("onRouterNavigateError", this);

                    console.log(error);

                    break;
                }
            }

            if (!route.component) {
                route.component = await route.load();
            }

            const container = route.parent?.component ?? document.body;

            const outlet = await new Promise((resolve) => {
                let outlet;
                let mutationObserver;
                let target = route.outlet ? document.body : container;
                let selector = route.outlet ? `nd-outlet[name="${route.outlet}"]` : "nd-outlet:not([name])";

                const callback = () => {
                    outlet = target.querySelector(selector);

                    if (outlet) {
                        if (mutationObserver) {
                            mutationObserver.disconnect();
                        }

                        resolve(outlet);
                    }
                };
                mutationObserver = new MutationObserver(callback);

                mutationObserver.observe(target, {
                    childList: true,
                    subtree: true,
                });

                callback();
            });

            if (!route.component.isConnected) {
                outlet.parentElement.insertBefore(route.component, outlet.nextElementSibling);

                route.component.isComponent = true;
            }

            const outlets = Array.from(document.body.querySelectorAll("nd-outlet"));

            for (const outlet of outlets) {
                let nextElement = outlet.nextElementSibling;

                while (nextElement) {
                    const unusedComponent = !routes.find((route) => route.component === nextElement) && nextElement.isComponent;
                    const unusedOutlet = !outlets.find((outlet) => outlet === nextElement);

                    if (unusedComponent && unusedOutlet) {
                        nextElement.remove();
                    }

                    nextElement = nextElement.nextElementSibling;
                }
            }
        }

        this.emit("onRouterNavigateSuccess", this);
    }

    /**
     * Menavigasi ke URL yang diberikan.
     * 
     * @param {string} url - URL yang akan dinavigasi.
     */
    static navigate(url) {
        window.history.pushState({}, null, url);
    }

    /**
     * Menangani klik pada elemen dengan atribut `routerLink`.
     * 
     * @private
     * @param {Event} event - Event klik yang ditangkap.
     */
    static handleClick(event) {
        const routerLink = event.target.closest("[routerLink]");
        if (routerLink) {
            const url = routerLink.getAttribute("routerLink");
            Router.navigate(url);
        }
    }

    /**
     * Memicu event kustom di window.
     * 
     * @param {string} type - Tipe event yang akan dipicu.
     * @param {Object} detail - Detail dari event yang akan dikirimkan.
     */
    static emit(type, detail) {
        const event = new CustomEvent(type, {
            cancelable: true,
            bubbles: true,
            detail,
        });
        window.dispatchEvent(event);
    }

    /**
     * Inisialisasi router dengan daftar rute yang diberikan.
     * 
     * @param {Array<Object>} routes - Daftar rute yang akan diinisialisasi.
     */
    static init(routes = []) {
        this.routes = this.setRoutes(routes);

        window.addEventListener("DOMContentLoaded", this.handleLoad.bind(this));
        window.addEventListener("popstate", this.handleLoad.bind(this));

        const pushState = window.history.pushState;

        window.history.pushState = function () {
            pushState.apply(this, arguments);

            Router.emit("popstate", this);
        };

        window.addEventListener("click", this.handleClick.bind(this));
    }
}

export { Router };
