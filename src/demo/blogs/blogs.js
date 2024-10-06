import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoBlogs extends NDComponent {
    render() {
        return html`
            <h1>Blogs</h1>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-blogs", DemoBlogs);

export default document.createElement("demo-blogs");
