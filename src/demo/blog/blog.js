import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoBlog extends NDComponent {
    render() {
        return html`
            <h1>Blog</h1>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-blog", DemoBlog);

export default document.createElement("demo-blog");
