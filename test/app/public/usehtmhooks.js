import { html, render, useState } from '/htm.js';
import { AppComp } from '/htmapp.js'
render(html`<${AppComp} />`, document.getElementById('app'), document.getElementById('app'))