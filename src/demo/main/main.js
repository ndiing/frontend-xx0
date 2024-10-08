import { html } from "lit";
import { NDComponent } from "../../material/component/component";

class DemoMain extends NDComponent {
    render() {
        return html`
            <div class="nd-border">
                <div class="md-border__item--west">
                    <div>
                        <div routerLink="/">/</div>
                        <div routerLink="/users">/users</div>
                        <div routerLink="/users/1">/users/1</div>
                        <div routerLink="/blogs/">/blogs/</div>
                        <div routerLink="/blogs/1">/blogs/1</div>
                        <div routerLink="/error">/error</div>
                    </div>
                </div>
                <div class="md-border__item--center">
                    <nd-outlet></nd-outlet>
                </div>
            </div>
        `;
    }
}

customElements.define("demo-main", DemoMain);

export default document.createElement("demo-main");
