import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoMain extends NDComponent {
    render() {
        return html`
            <h1>Main</h1>
            <div>
                <div routerLink="/">/</div>
                <div routerLink="/users">/users</div>
                <div routerLink="/users/1">/users/1</div>
                <div routerLink="/blogs/">/blogs/</div>
                <div routerLink="/blogs/1">/blogs/1</div>
                <div routerLink="/error">/error</div>
            </div>
            <nd-outlet name="user"></nd-outlet>
            <nd-outlet></nd-outlet>
        `;
    }
}

customElements.define("demo-main", DemoMain);

export default document.createElement("demo-main");
