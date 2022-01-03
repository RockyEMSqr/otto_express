import { Controller, Get } from "../..";
import render from 'preact-render-to-string';
import { h } from 'preact';
import { IndexPage, IndexPageComp } from "../wui";
import { Request } from "express";
import { html, Component } from 'htm/preact'
import { App, AppComp } from '../public/htmapp.js';

const Test = () => {
    return html`<h1>Test</h1>`;
}
@Controller('/ssr')
export class SSR {
    @Get('/')
    index(req: Request, res) {
        let html = render(IndexPage(req.query));
        res.send(`<!DOCTYPE html><html><body>${html}</body></html>`);
    }
    @Get('/1')
    index1(req: Request, res) {
        let html = render(h(IndexPageComp, req.query));
        res.send(`<!DOCTYPE html><html><body>${html}</body></html>`);
    }
    @Get('/htm')
    index2(req: Request, res) {
        let number = Number(req.query.x || 0);
        let thtml = render(html`<${AppComp} x=${number} />`);
        res.send(`
        <!DOCTYPE html>
        <html lang="en"><head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <body>
        <div id="app">${thtml}</div>
        <script>
        var x = ${number};
        </script>
        <script type="module" src="/usehtmhooks.js"></script>
    
    
    </body></html>`);
    }
}