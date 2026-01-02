class CarjobsAvatarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    createUrl(service, username) {
        return `https://unavatar.io/${service}/${username}`;
    }
    render() {
        const service = this.getAttribute('service') ?? 'github';
        const username = this.getAttribute('username') || 'user';
        const size = this.getAttribute('size') || '50px';
        console.log({ service, username, size });

        const url = this.createUrl(service, username);

        this.shadowRoot.innerHTML = `
            <img src="${url}" 
            alt="Perfil de usuario"
            class = "avatar"
            style="width: ${size}; height: ${size}; border-radius: 50%;">
        `;
    }   
    connectedCallback() {
        this.render();
    }
}
customElements.define('carjobs-avatar-element', CarjobsAvatarElement);