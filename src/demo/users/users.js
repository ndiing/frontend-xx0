import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoUsers extends NDComponent {
    render() {
        return html`
            <h1>Users</h1>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-users", DemoUsers);

export default document.createElement("demo-users");
