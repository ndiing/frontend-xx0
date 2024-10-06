import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoUser extends NDComponent {
    render() {
        return html`
            <h1>User</h1>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-user", DemoUser);

export default document.createElement("demo-user");
