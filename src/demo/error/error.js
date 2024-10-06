import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoError extends NDComponent {
    render() {
        return html`
            <h1>Error</h1>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-error", DemoError);

export default document.createElement("demo-error");
