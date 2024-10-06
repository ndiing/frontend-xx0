import { LitElement } from "lit";

/**
 * Kelas NDComponent yang merupakan turunan dari LitElement.
 * Digunakan untuk membuat komponen web dengan Lit.
 * 
 * @extends {LitElement}
 */
class NDComponent extends LitElement {
    /**
     * Mengoverride metode createRenderRoot untuk menggunakan elemen saat ini sebagai root render.
     * 
     * @returns {NDComponent} Elemen NDComponent itu sendiri.
     */
    createRenderRoot() {
        return this;
    }
}

export { NDComponent };
